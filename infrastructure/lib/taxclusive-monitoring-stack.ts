import * as cdk from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as logs from "aws-cdk-lib/aws-logs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export interface TaxclusiveMonitoringStackProps extends cdk.StackProps {
  environment: string;
  cloudFrontDistribution: cloudfront.Distribution;
  lambdaFunction: lambda.Function;
  s3Bucket: s3.Bucket;
}

export class TaxclusiveMonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TaxclusiveMonitoringStackProps) {
    super(scope, id, props);

    // SNS Topic for alerts
    const alertTopic = new sns.Topic(this, "AlertTopic", {
      topicName: `taxclusive-alerts-${props.environment}`,
      displayName: `Taxclusive Alerts - ${props.environment}`,
    });

    // Add email subscription (will need to be confirmed manually)
    const alertEmail = this.node.tryGetContext("alertEmail") || "alerts@taxclusive.com";
    alertTopic.addSubscription(new subscriptions.EmailSubscription(alertEmail));

    // CloudWatch Dashboard
    const dashboard = new cloudwatch.Dashboard(this, "MonitoringDashboard", {
      dashboardName: `Taxclusive-${props.environment}`,
    });

    // Lambda Metrics
    const lambdaErrorRate = new cloudwatch.Metric({
      namespace: "AWS/Lambda",
      metricName: "Errors",
      dimensionsMap: {
        FunctionName: props.lambdaFunction.functionName,
      },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });

    const lambdaDuration = new cloudwatch.Metric({
      namespace: "AWS/Lambda",
      metricName: "Duration",
      dimensionsMap: {
        FunctionName: props.lambdaFunction.functionName,
      },
      statistic: "Average",
      period: cdk.Duration.minutes(5),
    });

    const lambdaInvocations = new cloudwatch.Metric({
      namespace: "AWS/Lambda",
      metricName: "Invocations",
      dimensionsMap: {
        FunctionName: props.lambdaFunction.functionName,
      },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });

    const lambdaConcurrentExecutions = new cloudwatch.Metric({
      namespace: "AWS/Lambda",
      metricName: "ConcurrentExecutions",
      dimensionsMap: {
        FunctionName: props.lambdaFunction.functionName,
      },
      statistic: "Maximum",
      period: cdk.Duration.minutes(5),
    });

    // CloudFront Metrics
    const cloudFrontRequests = new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "Requests",
      dimensionsMap: {
        DistributionId: props.cloudFrontDistribution.distributionId,
      },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });

    const cloudFrontBytesDownloaded = new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "BytesDownloaded",
      dimensionsMap: {
        DistributionId: props.cloudFrontDistribution.distributionId,
      },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });

    const cloudFrontErrorRate = new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "4xxErrorRate",
      dimensionsMap: {
        DistributionId: props.cloudFrontDistribution.distributionId,
      },
      statistic: "Average",
      period: cdk.Duration.minutes(5),
    });

    const cloudFront5xxErrorRate = new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "5xxErrorRate",
      dimensionsMap: {
        DistributionId: props.cloudFrontDistribution.distributionId,
      },
      statistic: "Average",
      period: cdk.Duration.minutes(5),
    });

    const cloudFrontOriginLatency = new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "OriginLatency",
      dimensionsMap: {
        DistributionId: props.cloudFrontDistribution.distributionId,
      },
      statistic: "Average",
      period: cdk.Duration.minutes(5),
    });

    // Custom metric for SSR performance
    const ssrPerformanceMetric = new cloudwatch.Metric({
      namespace: "Taxclusive/SSR",
      metricName: "PageLoadTime",
      statistic: "Average",
      period: cdk.Duration.minutes(5),
    });

    // Dashboard Widgets
    dashboard.addWidgets(
      // Top row - Overview
      new cloudwatch.GraphWidget({
        title: "Request Volume",
        left: [cloudFrontRequests],
        width: 12,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "Lambda Invocations",
        left: [lambdaInvocations],
        width: 12,
        height: 6,
      }),

      // Second row - Performance
      new cloudwatch.GraphWidget({
        title: "Lambda Duration (ms)",
        left: [lambdaDuration],
        width: 8,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "CloudFront Origin Latency (ms)",
        left: [cloudFrontOriginLatency],
        width: 8,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "SSR Page Load Time (ms)",
        left: [ssrPerformanceMetric],
        width: 8,
        height: 6,
      }),

      // Third row - Error rates
      new cloudwatch.GraphWidget({
        title: "Lambda Errors",
        left: [lambdaErrorRate],
        width: 8,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "CloudFront 4xx Errors (%)",
        left: [cloudFrontErrorRate],
        width: 8,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "CloudFront 5xx Errors (%)",
        left: [cloudFront5xxErrorRate],
        width: 8,
        height: 6,
      }),

      // Fourth row - Resource utilization
      new cloudwatch.GraphWidget({
        title: "Lambda Concurrent Executions",
        left: [lambdaConcurrentExecutions],
        width: 12,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "Data Transfer (Bytes)",
        left: [cloudFrontBytesDownloaded],
        width: 12,
        height: 6,
      })
    );

    // Alarms

    // Lambda Error Rate Alarm
    const lambdaErrorAlarm = new cloudwatch.Alarm(this, "LambdaErrorRateAlarm", {
      alarmName: `Taxclusive-${props.environment}-Lambda-Errors`,
      alarmDescription: "Lambda function error rate is too high",
      metric: lambdaErrorRate,
      threshold: 5, // 5 errors in 5 minutes
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    lambdaErrorAlarm.addAlarmAction(new actions.SnsAction(alertTopic));

    // Lambda Duration Alarm
    const lambdaDurationAlarm = new cloudwatch.Alarm(this, "LambdaDurationAlarm", {
      alarmName: `Taxclusive-${props.environment}-Lambda-Duration`,
      alarmDescription: "Lambda function duration is too high",
      metric: lambdaDuration,
      threshold: 10000, // 10 seconds
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    lambdaDurationAlarm.addAlarmAction(new actions.SnsAction(alertTopic));

    // CloudFront 5xx Error Rate Alarm
    const cloudFront5xxAlarm = new cloudwatch.Alarm(this, "CloudFront5xxAlarm", {
      alarmName: `Taxclusive-${props.environment}-CloudFront-5xx`,
      alarmDescription: "CloudFront 5xx error rate is too high",
      metric: cloudFront5xxErrorRate,
      threshold: 5, // 5% error rate
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    cloudFront5xxAlarm.addAlarmAction(new actions.SnsAction(alertTopic));

    // High traffic alarm (production only)
    if (props.environment === "production") {
      const highTrafficAlarm = new cloudwatch.Alarm(this, "HighTrafficAlarm", {
        alarmName: `Taxclusive-${props.environment}-High-Traffic`,
        alarmDescription: "Unusually high traffic detected",
        metric: cloudFrontRequests,
        threshold: 10000, // 10k requests in 5 minutes
        evaluationPeriods: 1,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      // Don't alarm on high traffic, just notify
      highTrafficAlarm.addAlarmAction(new actions.SnsAction(alertTopic));
    }

    // Cost monitoring (production only)
    if (props.environment === "production") {
      const estimatedCharges = new cloudwatch.Metric({
        namespace: "AWS/Billing",
        metricName: "EstimatedCharges",
        dimensionsMap: {
          Currency: "USD",
        },
        statistic: "Maximum",
        period: cdk.Duration.hours(6),
      });

      const costAlarm = new cloudwatch.Alarm(this, "CostAlarm", {
        alarmName: `Taxclusive-${props.environment}-Cost-Alert`,
        alarmDescription: "Monthly costs are higher than expected",
        metric: estimatedCharges,
        threshold: 100, // $100 per month
        evaluationPeriods: 1,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      costAlarm.addAlarmAction(new actions.SnsAction(alertTopic));

      dashboard.addWidgets(
        new cloudwatch.GraphWidget({
          title: "Estimated Monthly Charges ($)",
          left: [estimatedCharges],
          width: 24,
          height: 6,
        })
      );
    }

    // Log Groups for structured logging
    const applicationLogGroup = new logs.LogGroup(this, "ApplicationLogGroup", {
      logGroupName: `/aws/lambda/${props.lambdaFunction.functionName}`,
      retention:
        props.environment === "production"
          ? logs.RetentionDays.ONE_MONTH
          : logs.RetentionDays.ONE_WEEK,
    });

    // Log metric filters for custom metrics
    new logs.MetricFilter(this, "SSRPageLoadTimeMetricFilter", {
      logGroup: applicationLogGroup,
      metricNamespace: "Taxclusive/SSR",
      metricName: "PageLoadTime",
      filterPattern: logs.FilterPattern.literal(
        '[timestamp, requestId, "SSR_PERFORMANCE", duration]'
      ),
      metricValue: "$duration",
    });

    new logs.MetricFilter(this, "ErrorLogMetricFilter", {
      logGroup: applicationLogGroup,
      metricNamespace: "Taxclusive/Application",
      metricName: "ApplicationErrors",
      filterPattern: logs.FilterPattern.anyTerm("ERROR", "Exception", "error"),
      metricValue: "1",
    });

    // Store monitoring configuration in SSM
    new ssm.StringParameter(this, "DashboardUrl", {
      parameterName: `/taxclusive/${props.environment}/monitoring/dashboard-url`,
      stringValue: `https://console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=${dashboard.dashboardName}`,
      description: "CloudWatch dashboard URL",
    });

    new ssm.StringParameter(this, "AlertTopicArn", {
      parameterName: `/taxclusive/${props.environment}/monitoring/alert-topic-arn`,
      stringValue: alertTopic.topicArn,
      description: "SNS topic ARN for alerts",
    });

    // Outputs
    new cdk.CfnOutput(this, "DashboardName", {
      value: dashboard.dashboardName,
      description: "CloudWatch Dashboard Name",
    });

    new cdk.CfnOutput(this, "AlertTopicArn", {
      value: alertTopic.topicArn,
      description: "SNS Alert Topic ARN",
    });

    new cdk.CfnOutput(this, "DashboardUrl", {
      value: `https://console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=${dashboard.dashboardName}`,
      description: "CloudWatch Dashboard URL",
    });
  }
}
