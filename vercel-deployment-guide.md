# Vercel Deployment Configuration for India

## Regional Configuration

Your project is now configured to deploy to Mumbai (bom1), the closest Vercel region to Delhi.

### Configuration Files Added:
- `vercel.json` - Configures deployment region and function settings

### Vercel Dashboard Setup:

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add these production values:

```bash
# Database
DATABASE_URL=postgresql://your-production-db-url

# Authentication
NEXTAUTH_URL=https://www.taxclusive.com
NEXTAUTH_SECRET=your-production-secret

# AWS (Mumbai region for better India performance)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Email
EMAIL_SENDER_NAME=Taxclusive
EMAIL_SENDER_ADDRESS=noreply@taxclusive.com
EMAIL_RECIPIENT_ADDRESS=contact@taxclusive.com

# Application
NEXT_PUBLIC_BASE_URL=https://www.taxclusive.com
NEXT_PUBLIC_APP_NAME=Taxclusive

# Security
CSRF_SECRET=your-production-csrf-secret
```

2. **Function Region Configuration:**
   - Your functions will deploy to Mumbai (bom1)
   - Static assets will be served from Vercel's global CDN
   - Maximum function duration is set to 30 seconds

3. **Performance Optimizations for India:**
   - Database: Already in ap-south-1 (Mumbai)
   - AWS Services: Set to ap-south-1 (Mumbai)
   - Vercel Functions: Set to bom1 (Mumbai)

### Next Steps:

1. Commit and push the `vercel.json` file
2. Update environment variables in Vercel dashboard
3. Redeploy your application

### Verification:

After deployment, you can verify the region by:
1. Checking response headers for `x-vercel-id` 
2. Using Vercel CLI: `vercel inspect [deployment-url]`
3. Monitoring latency from Delhi-based users

### Expected Performance Improvements:
- Reduced latency for Indian users
- Faster API responses (functions closer to database)
- Better overall user experience for Delhi region