import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import * as path from 'path';
import * as fs from 'fs';

// Initialize AWS clients
const s3Client = new S3Client({ region: process.env.REGION || 'us-east-1' });
const ssmClient = new SSMClient({ region: process.env.REGION || 'us-east-1' });

// Cache for configuration and frequently accessed data
const configCache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  value: any;
  timestamp: number;
}

// Helper function to get cached item or fetch new one
async function getCachedItem<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  const cached = configCache.get(key) as CacheItem;
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.value;
  }
  
  const value = await fetchFn();
  configCache.set(key, { value, timestamp: Date.now() });
  return value;
}

// Get SSM parameter
async function getSSMParameter(name: string): Promise<string> {
  return getCachedItem(
    `ssm:${name}`,
    async () => {
      const command = new GetParameterCommand({
        Name: name,
        WithDecryption: true,
      });
      const response = await ssmClient.send(command);
      return response.Parameter?.Value || '';
    }
  );
}

// Get S3 object
async function getS3Object(bucket: string, key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  
  const response = await s3Client.send(command);
  return response.Body?.transformToString() || '';
}

// Load Next.js configuration from S3
async function loadNextJSApp() {
  const bucketName = process.env.S3_BUCKET!;
  
  return getCachedItem(
    'nextjs-app',
    async () => {
      try {
        // Load the Next.js application files from S3
        const buildManifest = await getS3Object(bucketName, 'current/.next/build-manifest.json');
        const prerenderManifest = await getS3Object(bucketName, 'current/.next/prerender-manifest.json');
        
        // Parse manifests
        const buildData = JSON.parse(buildManifest);
        const prerenderData = JSON.parse(prerenderManifest);
        
        return {
          buildManifest: buildData,
          prerenderManifest: prerenderData,
        };
      } catch (error) {
        console.error('Failed to load Next.js app:', error);
        throw error;
      }
    },
    10 * 60 * 1000 // 10 minutes cache for app files
  );
}

// Main Lambda handler
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const startTime = Date.now();
  
  try {
    // Extract request information
    const { httpMethod, path: requestPath, headers, queryStringParameters, body } = event;
    const host = headers.Host || headers.host;
    
    console.log(`[${context.requestId}] ${httpMethod} ${requestPath}`, {
      headers: Object.keys(headers),
      hasBody: !!body,
      queryParams: queryStringParameters,
    });

    // Handle health check
    if (requestPath === '/api/health') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: process.env.ENVIRONMENT,
          requestId: context.requestId,
        }),
      };
    }

    // Load Next.js app configuration
    const nextjsApp = await loadNextJSApp();
    
    // Route handling based on request path
    let response: APIGatewayProxyResult;
    
    if (requestPath.startsWith('/api/')) {
      // Handle API routes
      response = await handleAPIRoute(event, context);
    } else if (requestPath.startsWith('/_next/')) {
      // Handle Next.js static assets (should be served by CloudFront/S3)
      response = await handleStaticAsset(event, context);
    } else {
      // Handle SSR pages
      response = await handleSSRPage(event, context, nextjsApp);
    }
    
    // Log performance metrics
    const duration = Date.now() - startTime;
    console.log(`[${context.requestId}] SSR_PERFORMANCE ${duration}`);
    
    // Add performance headers
    response.headers = {
      ...response.headers,
      'X-Response-Time': `${duration}ms`,
      'X-Request-ID': context.requestId,
    };
    
    return response;
    
  } catch (error) {
    console.error(`[${context.requestId}] ERROR:`, error);
    
    const duration = Date.now() - startTime;
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': `${duration}ms`,
        'X-Request-ID': context.requestId,
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
      }),
    };
  }
}

// Handle API routes
async function handleAPIRoute(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { path: requestPath, httpMethod, body, headers } = event;
  
  // Get environment variables from SSM
  const environment = process.env.ENVIRONMENT || 'staging';
  
  try {
    // Load environment-specific configuration
    const config = await getCachedItem(
      'api-config',
      async () => ({
        awsRegion: await getSSMParameter(`/taxclusive/${environment}/aws/region`),
        sesFrom: await getSSMParameter(`/taxclusive/${environment}/ses/from-email`),
        sesTo: await getSSMParameter(`/taxclusive/${environment}/ses/to-email`),
        strapiUrl: await getSSMParameter(`/taxclusive/${environment}/strapi/url`),
        strapiToken: await getSSMParameter(`/taxclusive/${environment}/strapi/token`),
      })
    );
    
    // Handle different API routes
    if (requestPath === '/api/contact' && httpMethod === 'POST') {
      return await handleContactForm(JSON.parse(body || '{}'), config, context);
    }
    
    if (requestPath === '/api/appointment' && httpMethod === 'POST') {
      return await handleAppointmentForm(JSON.parse(body || '{}'), config, context);
    }
    
    if (requestPath === '/api/newsletter' && httpMethod === 'POST') {
      return await handleNewsletterForm(JSON.parse(body || '{}'), config, context);
    }
    
    // Default 404 for unknown API routes
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'API route not found' }),
    };
    
  } catch (error) {
    console.error(`API route error:`, error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}

// Handle static assets (fallback, should be served by CloudFront)
async function handleStaticAsset(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { path: requestPath } = event;
  const bucketName = process.env.S3_BUCKET!;
  
  try {
    // Try to get the asset from S3
    const key = `current${requestPath}`;
    const content = await getS3Object(bucketName, key);
    
    // Determine content type
    const ext = path.extname(requestPath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentTypeMap[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: content,
      isBase64Encoded: false,
    };
    
  } catch (error) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Asset not found',
    };
  }
}

// Handle SSR pages
async function handleSSRPage(
  event: APIGatewayProxyEvent,
  context: Context,
  nextjsApp: any
): Promise<APIGatewayProxyResult> {
  const { path: requestPath, queryStringParameters } = event;
  
  try {
    // Simulate Next.js SSR (in a real implementation, you'd use Next.js server)
    // For now, return a basic HTML response with proper meta tags
    
    const pageTitle = getPageTitle(requestPath);
    const pageDescription = getPageDescription(requestPath);
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDescription}">
    <meta property="og:type" content="website">
    <link rel="icon" href="/favicon.ico">
    <link rel="canonical" href="https://taxclusive.com${requestPath}">
</head>
<body>
    <div id="__next">
        <div>Loading Taxclusive...</div>
    </div>
    <script>
        window.__NEXT_DATA__ = ${JSON.stringify({
          props: { pageProps: {} },
          page: requestPath,
          query: queryStringParameters || {},
          buildId: nextjsApp.buildManifest?.buildId || 'unknown',
        })};
    </script>
</body>
</html>`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
      body: html,
    };
    
  } catch (error) {
    console.error('SSR error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>500 - Internal Server Error</h1></body></html>',
    };
  }
}

// Helper functions for form handling
async function handleContactForm(data: any, config: any, context: Context) {
  // Implement SES email sending logic here
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, message: 'Contact form submitted successfully' }),
  };
}

async function handleAppointmentForm(data: any, config: any, context: Context) {
  // Implement appointment booking logic here
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, message: 'Appointment booked successfully' }),
  };
}

async function handleNewsletterForm(data: any, config: any, context: Context) {
  // Implement newsletter subscription logic here
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, message: 'Newsletter subscription successful' }),
  };
}

// Helper functions for SEO
function getPageTitle(path: string): string {
  const titleMap: Record<string, string> = {
    '/': 'Taxclusive - Premier Chartered Accountancy Services',
    '/about': 'About Us - Taxclusive CA Firm',
    '/services': 'Our Services - Taxclusive',
    '/contact': 'Contact Us - Taxclusive',
    '/blogs': 'Blog - Latest Tax Updates & Insights',
    '/faq': 'Frequently Asked Questions - Taxclusive',
  };
  
  return titleMap[path] || `Taxclusive - ${path.replace('/', '').replace('-', ' ')}`;
}

function getPageDescription(path: string): string {
  const descriptionMap: Record<string, string> = {
    '/': 'Professional chartered accountancy services for businesses and individuals. Expert tax consultation, compliance, and financial advisory services.',
    '/about': 'Learn about Taxclusive, our experienced team of chartered accountants and our commitment to excellence in financial services.',
    '/services': 'Comprehensive CA services including tax planning, audit, compliance, GST, income tax, and financial advisory services.',
    '/contact': 'Get in touch with Taxclusive for professional chartered accountancy services. Contact our expert CA team today.',
    '/blogs': 'Stay updated with the latest tax news, regulations, and financial insights from our expert chartered accountants.',
    '/faq': 'Find answers to frequently asked questions about our chartered accountancy services, tax compliance, and financial advisory.',
  };
  
  return descriptionMap[path] || 'Professional chartered accountancy services by Taxclusive - your trusted CA firm.';
}