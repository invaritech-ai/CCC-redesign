# Sitemap Setup and Configuration

This document explains how the dynamic sitemap works and how to set up automatic updates via Sanity webhooks.

## Overview

The sitemap is dynamically generated at `/sitemap.xml` by querying Sanity CMS for all content. When new content is added or updated in Sanity, webhooks can trigger cache invalidation to ensure the sitemap stays up-to-date.

## Sitemap URL

-   **Production**: `https://chinacoastcommunity.org.hk/sitemap.xml`
-   **Development**: `http://localhost:3000/sitemap.xml` (when running locally)

## Included Content Types

The sitemap automatically includes:

### Static Routes

-   Homepage (`/`)
-   About pages (`/who-we-are/about`, `/who-we-are/history`, etc.)
-   Community pages (`/care-community/*`)
-   News pages (`/news`, `/news/stories`, `/news/blog`, etc.)
-   Events listing (`/care-community/activities-and-events`)
-   Reports listing (`/reports`, `/who-we-are/publications/annual-reports`)
-   Other static pages

### Dynamic CMS Content

-   **Updates** (News articles, stories, announcements, initiatives)
    -   Path: `/news/:slug` or `/news/stories/:slug` (based on type)
-   **Events**
    -   Path: `/care-community/activities-and-events/:slug`
-   **Reports**
    -   Path: `/who-we-are/publications/annual-reports/:slug` and `/reports/:slug`
-   **Galleries**
    -   Path: `/news/media-and-press/galleries/:slug`
-   **Press Releases**
    -   Path: `/news/media-and-press/press-releases/:slug`
-   **Case Studies**
    -   Path: `/news/stories/:slug`
-   **CMS Pages** (pageContent)
    -   Path: Based on `pageSlug` field

## Setting Up Sanity Webhooks

To automatically update the sitemap when content changes in Sanity:

### Step 1: Generate Webhook Secret

1. Generate a secure random string (at least 32 characters):

    ```bash
    openssl rand -hex 32
    ```

2. Add it to your Vercel environment variables:
    - Go to your Vercel project dashboard
    - Navigate to Settings → Environment Variables
    - Add `SANITY_WEBHOOK_SECRET` with the generated secret value
    - Apply to Production, Preview, and Development environments

### Step 2: Configure Sanity Webhook

1. Go to your Sanity project dashboard: https://www.sanity.io/manage
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create webhook**
5. Configure the webhook:

    - **Name**: `Sitemap Update`
    - **URL**: `https://chinacoastcommunity.org.hk/api/webhooks/sanity`
    - **Dataset**: `production` (or your dataset name)
    - **Trigger on**: Select the content types you want to trigger updates:
        - `create` - When new content is created
        - `update` - When content is updated
        - `delete` - When content is deleted
    - **Filter** (optional): Leave empty to trigger on all documents
    - **Projection** (optional): Leave empty
    - **HTTP method**: `POST`
    - **API version**: `v2021-03-25` or later
    - **Secret**: Enter the same secret you added to Vercel (`SANITY_WEBHOOK_SECRET`)

6. Click **Save**

### Step 3: Test the Webhook

1. Create or update a document in Sanity
2. Check Vercel function logs to verify the webhook was received
3. Visit `/sitemap.xml` to confirm the new content appears

## Environment Variables

Required environment variables:

-   `VITE_SANITY_PROJECT_ID` or `SANITY_PROJECT_ID` - Your Sanity project ID
-   `VITE_SANITY_DATASET` or `SANITY_DATASET` - Your Sanity dataset (default: `production`)
-   `VITE_SANITY_API_VERSION` or `SANITY_API_VERSION` - API version (default: `2024-01-01`)
-   `SANITY_WEBHOOK_SECRET` (optional but recommended) - Secret for webhook signature verification

## How It Works

1. **Sitemap Generation**: When `/sitemap.xml` is requested:

    - The API route queries Sanity for all content types
    - Generates XML following the sitemap.org protocol
    - Includes static routes and dynamic CMS content
    - Sets appropriate `lastmod`, `changefreq`, and `priority` values

2. **Caching**: The sitemap is cached for 1 hour (`s-maxage=3600`) with stale-while-revalidate for 24 hours

3. **Webhook Processing**: When Sanity sends a webhook:
    - The webhook handler verifies the signature (if `SANITY_WEBHOOK_SECRET` is set)
    - Logs the event for debugging
    - Triggers cache revalidation (if configured)

## Troubleshooting

### Sitemap not updating

1. **Check Sanity connection**: Verify environment variables are set correctly
2. **Check webhook logs**: View function logs in Vercel dashboard
3. **Manual refresh**: The sitemap cache expires after 1 hour, or you can manually trigger a rebuild

### Webhook not working

1. **Verify secret**: Ensure `SANITY_WEBHOOK_SECRET` matches in both Sanity and Vercel
2. **Check URL**: Ensure the webhook URL is correct: `https://chinacoastcommunity.org.hk/api/webhooks/sanity`
3. **Check logs**: Review Vercel function logs for errors
4. **Test locally**: Use a tool like ngrok to test webhooks locally

### Missing content in sitemap

1. **Check Sanity**: Verify the content exists and has a valid `slug` field
2. **Check queries**: Review the sitemap API route queries to ensure they match your schema
3. **Check logs**: Look for errors in the sitemap generation logs

## Robots.txt

Make sure your `robots.txt` includes the sitemap:

```
Sitemap: https://chinacoastcommunity.org.hk/sitemap.xml
```

The sitemap is already referenced in `public/robots.txt` if it exists.

## Priority and Change Frequency

The sitemap uses the following defaults:

-   **Homepage**: Priority 1.0, Daily
-   **Main pages**: Priority 0.8, Monthly
-   **News/Updates**: Priority 0.6-0.7, Weekly
-   **Events**: Priority 0.7, Weekly
-   **Reports**: Priority 0.6, Yearly
-   **Galleries**: Priority 0.5, Monthly
-   **Press Releases**: Priority 0.6, Monthly

These can be adjusted in `/api/sitemap.xml.ts` if needed.

## Manual Sitemap Regeneration

If you need to manually regenerate the sitemap:

1. **Via Vercel Dashboard**:

    - Go to your project → Deployments
    - Click "Redeploy" on the latest deployment

2. **Via API** (if revalidation is set up):

    - Call the webhook endpoint with a test payload

3. **Wait for cache expiry**: The sitemap cache expires after 1 hour automatically
