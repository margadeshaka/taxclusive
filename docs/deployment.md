# TaxExclusive Deployment Documentation

This document provides comprehensive information about the deployment process and environments for the TaxExclusive application.

## Table of Contents

1. [Environments](#environments)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Deployment Process](#deployment-process)
5. [Continuous Integration/Continuous Deployment](#continuous-integrationcontinuous-deployment)
6. [Rollback Procedure](#rollback-procedure)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Performance Considerations](#performance-considerations)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

## Environments

TaxExclusive uses three environments for its deployment pipeline:

### Development Environment

- **Purpose**: For active development and testing new features
- **URL**: https://dev.taxexclusive.com
- **Deployment**: Automatic from the `develop` branch
- **Hosting**: Vercel (Development)
- **Database**: Strapi CMS (Development Instance)

### Staging Environment

- **Purpose**: For pre-production testing and client review
- **URL**: https://staging.taxexclusive.com
- **Deployment**: Manual promotion from Development
- **Hosting**: Vercel (Preview)
- **Database**: Strapi CMS (Staging Instance)

### Production Environment

- **Purpose**: Live environment for end users
- **URL**: https://taxexclusive.com
- **Deployment**: Manual promotion from Staging
- **Hosting**: Vercel (Production)
- **Database**: Strapi CMS (Production Instance)

## Prerequisites

Before deploying the application, ensure you have:

1. Access to the Vercel account
2. Access to the Strapi CMS admin panel
3. Proper environment variables set up for each environment
4. All tests passing in the CI pipeline

## Environment Variables

The following environment variables are required for deployment:

| Variable                         | Description                  | Required in         |
| -------------------------------- | ---------------------------- | ------------------- |
| `NEXT_PUBLIC_STRAPI_API_URL`     | URL of the Strapi CMS API    | All environments    |
| `NEXT_PUBLIC_STRAPI_API_KEY`     | API key for Strapi CMS       | All environments    |
| `NEXT_PUBLIC_SITE_URL`           | Base URL of the application  | All environments    |
| `NEXT_PUBLIC_GA_TRACKING_ID`     | Google Analytics tracking ID | Staging, Production |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key    | All environments    |
| `RECAPTCHA_SECRET_KEY`           | Google reCAPTCHA secret key  | All environments    |

For local development, copy `.env.local.example` to `.env.local` and fill in the required values.

## Deployment Process

### Deploying to Development

1. Push your changes to the `develop` branch
2. Vercel will automatically deploy the changes to the development environment
3. Verify the deployment at https://dev.taxexclusive.com

### Deploying to Staging

1. Ensure all tests pass in the development environment
2. Create a pull request from `develop` to `staging`
3. After review and approval, merge the pull request
4. Vercel will automatically deploy the changes to the staging environment
5. Verify the deployment at https://staging.taxexclusive.com
6. Perform manual testing to ensure everything works as expected

### Deploying to Production

1. Ensure all tests pass in the staging environment
2. Create a pull request from `staging` to `main`
3. After review and approval, merge the pull request
4. Vercel will automatically deploy the changes to the production environment
5. Verify the deployment at https://taxexclusive.com
6. Monitor the application for any issues

## Continuous Integration/Continuous Deployment

TaxExclusive uses GitHub Actions for CI/CD:

1. **Continuous Integration**:
   - Runs on every push and pull request
   - Runs linting, type checking, and tests
   - Builds the application to ensure it compiles correctly

2. **Continuous Deployment**:
   - Automatically deploys to the development environment on push to `develop`
   - Automatically deploys to the staging environment on push to `staging`
   - Automatically deploys to the production environment on push to `main`

## Rollback Procedure

If issues are detected after deployment, follow these steps to rollback:

### Immediate Rollback (Vercel)

1. Go to the Vercel dashboard
2. Navigate to the project and select the environment
3. Find the previous successful deployment
4. Click "Redeploy" to rollback to that version

### Git-based Rollback

1. Revert the merge commit that caused the issue
2. Push the revert commit to the appropriate branch
3. Vercel will automatically deploy the reverted version

## Monitoring and Logging

TaxExclusive uses the following tools for monitoring and logging:

1. **Vercel Analytics**: For performance monitoring and error tracking
2. **Google Analytics**: For user behavior tracking
3. **Sentry**: For error tracking and reporting
4. **Uptime Robot**: For uptime monitoring

Check these tools regularly to ensure the application is performing as expected.

## Performance Considerations

When deploying, consider the following performance aspects:

1. **Bundle Size**: Monitor the JavaScript bundle size to ensure it remains optimized
2. **Image Optimization**: Ensure images are properly optimized
3. **Caching Strategy**: Verify that caching headers are correctly set
4. **API Performance**: Monitor API response times and optimize if necessary

## Security Considerations

Ensure the following security measures are in place:

1. **HTTPS**: All environments must use HTTPS
2. **Content Security Policy**: Verify CSP headers are correctly set
3. **API Keys**: Ensure API keys are not exposed in client-side code
4. **Rate Limiting**: Verify rate limiting is working correctly
5. **CSRF Protection**: Ensure CSRF protection is enabled

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   - Check the build logs for errors
   - Verify that all dependencies are correctly installed
   - Ensure environment variables are correctly set

2. **Runtime Errors**:
   - Check the browser console for JavaScript errors
   - Verify API endpoints are accessible
   - Check Sentry for error reports

3. **Performance Issues**:
   - Run Lighthouse audits to identify performance bottlenecks
   - Check network requests for slow responses
   - Verify caching is working correctly

### Getting Help

If you encounter issues that you cannot resolve, contact:

- **Development Team**: For code-related issues
- **DevOps Team**: For infrastructure and deployment issues
- **Vercel Support**: For Vercel-specific issues
