# Deployment Guide - Purgatory Townhouse Website

## Overview
This guide covers deploying the Purgatory Townhouse Next.js website to production.

## Pre-Deployment Checklist

- [ ] All content updated (contact info, pricing, descriptions)
- [ ] Real property images uploaded
- [ ] Payment processor configured (if using Stripe/Square)
- [ ] SSL certificate ready
- [ ] Domain configured
- [ ] Email service configured
- [ ] Analytics setup (Google Analytics)
- [ ] Backup strategy in place

## Deployment Options

### 1. Vercel (Recommended for Next.js)

**Advantages:**
- Automatic deployments on git push
- Built-in Next.js optimization
- Serverless functions
- Global CDN
- Free tier available

**Steps:**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the GitHub repository
4. Configure environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   STRIPE_SECRET_KEY=sk_xxx
   ```
5. Click "Deploy"

**Post-Deployment:**
```bash
# Custom domain
vercel domains add purgatorytownhouse.com

# Environment variables
vercel env add NEXT_PUBLIC_API_URL
```

---

### 2. AWS Amplify

**Advantages:**
- AWS ecosystem integration
- Easy custom domain
- Built-in CI/CD
- Scalable

**Steps:**

1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
4. Set environment variables
5. Deploy

---

### 3. Docker + Traditional Hosting

**Create Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public
COPY next.config.ts ./

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and Run:**
```bash
docker build -t purgatory-townhouse .
docker run -p 3000:3000 purgatory-townhouse
```

**Deploy to Hosting:**
- Push to Docker Hub: `docker push yourusername/purgatory-townhouse`
- Deploy to AWS ECS, Google Cloud Run, or similar

---

### 4. Traditional Node.js Hosting (Heroku, Linode, DigitalOcean)

**Procfile (for Heroku):**
```
web: npm start
```

**Deploy:**
```bash
heroku create purgatory-townhouse
git push heroku bot/dev:main
heroku open
```

**DigitalOcean:**
1. Create Droplet (Node.js)
2. Clone repository
3. Install dependencies
4. Build project
5. Use PM2 for process management
6. Configure Nginx as reverse proxy

---

## Environment Variables

Create `.env.production` with:

```env
# API
NEXT_PUBLIC_API_URL=https://api.purgatorytownhouse.com
NEXT_PUBLIC_SITE_URL=https://purgatorytownhouse.com

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx

# Email Service
SENDGRID_API_KEY=SG_xxx

# Analytics
NEXT_PUBLIC_GA_ID=G_xxx

# Map API (if not using embedded Google Map)
NEXT_PUBLIC_MAPBOX_TOKEN=pk_xxx
```

---

## Database Setup (Optional)

If using a database for bookings:

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20),
  special_requests TEXT,
  total_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER NOT NULL,
  review_text TEXT,
  guest_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## SSL/TLS Certificate

### Let's Encrypt (Free)
```bash
# Using Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d purgatorytownhouse.com

# Configure Nginx with certificate
```

### AWS Certificate Manager (Free)
- Request certificate in ACM
- Validate domain
- Attach to CloudFront/ALB

---

## Performance Optimization

### Caching Headers
```javascript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  headers: [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
})
```

### Image Optimization
- Images are already optimized via Next.js Image component
- Automatic WebP conversion
- Responsive image sizing

### Code Splitting
- Automatic by Next.js
- No additional configuration needed

---

## Monitoring & Logging

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

Configure in `next.config.ts`:
```javascript
withSentryConfig(nextConfig, {
  org: "organization",
  project: "purgatory-townhouse",
  authToken: process.env.SENTRY_AUTH_TOKEN,
})
```

### CloudWatch / ELK Stack
- Monitor application logs
- Set up alerts
- Track performance metrics

---

## Backup Strategy

```bash
# Daily backups to S3
aws s3 sync . s3://purgatory-backups/$(date +%Y-%m-%d)/ --delete

# Database backups
pg_dump -h localhost dbname > backup_$(date +%Y-%m-%d).sql
```

---

## Scaling

### Horizontal Scaling
- Multiple instances behind load balancer
- Vercel handles automatically
- AWS ALB + multiple servers

### Vertical Scaling
- Increase server resources
- Upgrade database tier
- Enable caching (Redis)

---

## Rollback Plan

```bash
# If deployment fails
git revert HEAD
git push heroku
# or
vercel --prod --confirm
```

---

## Domain Configuration

### DNS Records
```
Type    Name            Value
A       @               [IP Address]
CNAME   www             [Hosting Domain]
MX      @               mail.[domain]
TXT     @               v=spf1 ...
```

### Redirect www to non-www
```nginx
server {
    server_name www.purgatorytownhouse.com;
    return 301 https://purgatorytownhouse.com$request_uri;
}
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on forms
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens enabled
- [ ] API keys secured
- [ ] Regular security updates

---

## Support & Monitoring

**Uptime Monitoring:**
- UptimeRobot for 24/7 monitoring
- PagerDuty for alerts

**Performance Monitoring:**
- Datadog or New Relic
- Monitor page load times
- Track user interactions

**Support Channels:**
- Email: info@purgatorytownhouse.com
- Phone: (123) 456-7890
- Support hours: 24/7 for critical issues

---

## Post-Launch Checklist

- [ ] Verify all pages load correctly
- [ ] Test booking flow end-to-end
- [ ] Verify email notifications working
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Verify analytics tracking
- [ ] Test payment processing (sandbox)
- [ ] Monitor uptime and performance
- [ ] Backup database daily
- [ ] Review logs regularly

---

## Troubleshooting

### High Server Load
- Check for memory leaks
- Review slow database queries
- Implement caching
- Scale horizontally

### Booking Form Not Working
- Check API endpoint configuration
- Verify database connection
- Check error logs
- Test with curl/Postman

### Email Not Sending
- Verify SendGrid/mail service API key
- Check spam filters
- Review email logs
- Test with manual trigger

---

## Contact & Support

For deployment issues or questions:
- Email: support@purgatorytownhouse.com
- Slack: #deployment-support

---

**Last Updated**: 2024
**Version**: 1.0
