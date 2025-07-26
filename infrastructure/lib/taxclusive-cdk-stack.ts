import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export interface TaxclusiveCdkStackProps extends cdk.StackProps {
  environment: string;
  domainName: string;
  certificateArn?: string;
  logRetentionDays: number;
  enableXRayTracing: boolean;
  minCapacity: number;
  maxCapacity: number;
}

export class TaxclusiveCdkStack extends cdk.Stack {
  public readonly cloudFrontDistribution: cloudfront.Distribution;
  public readonly nextjsLambda: lambda.Function;
  public readonly s3Bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: TaxclusiveCdkStackProps) {
    super(scope, id, props);

    // S3 Bucket for static assets and deployment artifacts
    this.s3Bucket = new s3.Bucket(this, 'StaticAssetsBucket', {
      bucketName: `taxclusive-assets-${props.environment}-${this.account}`,
      removalPolicy: props.environment === 'production' 
        ? cdk.RemovalPolicy.RETAIN 
        : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: props.environment !== 'production',
      versioning: {
        enabled: true,
      },
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3600,
        },
      ],
      lifecycleRules: [
        {
          id: 'DeleteIncompleteMultipartUploads',
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
        },
        {
          id: 'TransitionToIA',
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
          ],
        },
      ],
    });

    // IAM Role for Lambda function
    const lambdaRole = new iam.Role(this, 'NextjsLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
      ],
      inlinePolicies: {
        S3Access: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['s3:GetObject', 's3:ListBucket'],
              resources: [
                this.s3Bucket.bucketArn,
                `${this.s3Bucket.bucketArn}/*`,
              ],
            }),
          ],
        }),
        SESAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'ses:SendEmail',
                'ses:SendRawEmail',
                'ses:GetSendQuota',
                'ses:GetSendStatistics',
              ],
              resources: ['*'],
            }),
          ],
        }),
        SSMAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'ssm:GetParameter',
                'ssm:GetParameters',
                'ssm:GetParametersByPath',
              ],
              resources: [
                `arn:aws:ssm:${this.region}:${this.account}:parameter/taxclusive/${props.environment}/*`,
              ],
            }),
          ],
        }),
      },
    });

    // Lambda function for Next.js SSR
    this.nextjsLambda = new lambdaNodejs.NodejsFunction(this, 'NextjsLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/nextjs-handler.ts'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      role: lambdaRole,
      environment: {
        NODE_ENV: 'production',
        ENVIRONMENT: props.environment,
        S3_BUCKET: this.s3Bucket.bucketName,
        REGION: this.region,
      },
      bundling: {
        externalModules: ['aws-sdk'],
        minify: true,
        sourceMap: true,
      },
      logRetention: props.logRetentionDays as logs.RetentionDays,
      tracing: props.enableXRayTracing ? lambda.Tracing.ACTIVE : lambda.Tracing.DISABLED,
      reservedConcurrentExecutions: props.maxCapacity,
    });

    // Lambda function URL for direct invocation
    const lambdaUrl = this.nextjsLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowCredentials: true,
        allowedHeaders: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedOrigins: ['*'],
        maxAge: cdk.Duration.days(1),
      },
    });

    // Lambda@Edge function for request/response manipulation
    const edgeFunction = new lambda.Function(this, 'EdgeFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          const request = event.Records[0].cf.request;
          const response = event.Records[0].cf.response;
          
          // Add security headers
          if (response) {
            response.headers['strict-transport-security'] = [{
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload'
            }];
            response.headers['x-content-type-options'] = [{
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            }];
            response.headers['x-frame-options'] = [{
              key: 'X-Frame-Options',
              value: 'DENY'
            }];
            response.headers['x-xss-protection'] = [{
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            }];
            response.headers['referrer-policy'] = [{
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            }];
          }
          
          // Handle trailing slashes
          if (request && request.uri.endsWith('/') && request.uri.length > 1) {
            request.uri = request.uri.slice(0, -1);
          }
          
          return response || request;
        };
      `),
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
    });

    // CloudFront Origin Request Policy
    const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'OriginRequestPolicy', {
      originRequestPolicyName: `taxclusive-origin-request-${props.environment}`,
      comment: 'Origin request policy for Next.js SSR',
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList(
        'Accept',
        'Accept-Language',
        'Accept-Encoding',
        'Host',
        'User-Agent',
        'Referer',
        'X-Forwarded-For',
        'CloudFront-Viewer-Country',
        'CloudFront-Is-Mobile-Viewer',
        'CloudFront-Is-Tablet-Viewer',
        'CloudFront-Is-Desktop-Viewer'
      ),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
    });

    // CloudFront Cache Policy
    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      cachePolicyName: `taxclusive-cache-${props.environment}`,
      comment: 'Cache policy for Next.js SSR',
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.seconds(0),
      cookieBehavior: cloudfront.CacheCookieBehavior.allowList('__prerender_bypass', '__next_preview_data'),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        'Accept',
        'Accept-Language',
        'Authorization',
        'CloudFront-Viewer-Country'
      ),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList('utm_source', 'utm_medium', 'utm_campaign'),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    // SSL Certificate (if provided)
    let certificate: certificatemanager.ICertificate | undefined;
    if (props.certificateArn) {
      certificate = certificatemanager.Certificate.fromCertificateArn(
        this,
        'SSLCertificate',
        props.certificateArn
      );
    }

    // CloudFront Distribution
    this.cloudFrontDistribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
      defaultBehavior: {
        origin: new origins.FunctionUrlOrigin(lambdaUrl),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cachePolicy,
        originRequestPolicy: originRequestPolicy,
        edgeLambdas: [
          {
            functionVersion: edgeFunction.currentVersion,
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          },
        ],
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
      },
      additionalBehaviors: {
        // Static assets from S3
        '/_next/static/*': {
          origin: new origins.S3Origin(this.s3Bucket, {
            originPath: '/current/_next/static',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
        },
        '/static/*': {
          origin: new origins.S3Origin(this.s3Bucket, {
            originPath: '/current/static',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
        },
        // Public assets
        '/favicon.ico': {
          origin: new origins.S3Origin(this.s3Bucket, {
            originPath: '/current/public',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        '/*.png': {
          origin: new origins.S3Origin(this.s3Bucket, {
            originPath: '/current/public',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        '/*.jpg': {
          origin: new origins.S3Origin(this.s3Bucket, {
            originPath: '/current/public',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        '/*.svg': {
          origin: new origins.S3Origin(this.s3Bucket, {
            originPath: '/current/public',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
      domainNames: certificate ? [props.domainName] : undefined,
      certificate: certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      comment: `Taxclusive Next.js distribution - ${props.environment}`,
      defaultRootObject: '',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 500,
          responseHttpStatus: 500,
          responsePagePath: '/500',
          ttl: cdk.Duration.minutes(1),
        },
      ],
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    // Route53 DNS (if domain is provided)
    if (certificate && props.domainName) {
      const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: props.domainName.includes('.') 
          ? props.domainName.split('.').slice(-2).join('.') 
          : props.domainName,
      });

      new route53.ARecord(this, 'AliasRecord', {
        zone: hostedZone,
        recordName: props.domainName,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(this.cloudFrontDistribution)
        ),
      });

      new route53.AaaaRecord(this, 'AliasRecordIPv6', {
        zone: hostedZone,
        recordName: props.domainName,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(this.cloudFrontDistribution)
        ),
      });
    }

    // SSM Parameters for application configuration
    new ssm.StringParameter(this, 'CloudFrontDistributionId', {
      parameterName: `/taxclusive/${props.environment}/cloudfront/distribution-id`,
      stringValue: this.cloudFrontDistribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new ssm.StringParameter(this, 'CloudFrontDomainName', {
      parameterName: `/taxclusive/${props.environment}/cloudfront/domain-name`,
      stringValue: this.cloudFrontDistribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
    });

    new ssm.StringParameter(this, 'S3BucketName', {
      parameterName: `/taxclusive/${props.environment}/s3/bucket-name`,
      stringValue: this.s3Bucket.bucketName,
      description: 'S3 bucket name for static assets',
    });

    new ssm.StringParameter(this, 'LambdaFunctionName', {
      parameterName: `/taxclusive/${props.environment}/lambda/function-name`,
      stringValue: this.nextjsLambda.functionName,
      description: 'Lambda function name for Next.js SSR',
    });

    // Outputs
    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: this.cloudFrontDistribution.distributionId,
      description: 'CloudFront Distribution ID',
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionDomainName', {
      value: this.cloudFrontDistribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: this.s3Bucket.bucketName,
      description: 'S3 Bucket Name',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionUrl', {
      value: lambdaUrl.url,
      description: 'Lambda Function URL',
    });

    if (certificate && props.domainName) {
      new cdk.CfnOutput(this, 'WebsiteUrl', {
        value: `https://${props.domainName}`,
        description: 'Website URL',
      });
    }
  }
}