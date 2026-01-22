# Cloudflare Turnstile CAPTCHA Setup Instructions

This guide will help you set up Cloudflare Turnstile CAPTCHA to protect your forms from spam and abuse.

## What is Cloudflare Turnstile?

Cloudflare Turnstile is a free, privacy-focused CAPTCHA alternative that provides:
- **Completely free** - No usage limits
- **Privacy-friendly** - GDPR compliant, no tracking
- **User-friendly** - Often invisible or minimal interaction required
- **Effective** - Strong bot protection

## Step 1: Create a Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up for a free Cloudflare account (if you don't have one)
3. Verify your email address

## Step 2: Add Your Site to Cloudflare (Optional)

**Note**: You don't need to use Cloudflare's CDN/DNS to use Turnstile. You can use Turnstile on any website.

However, if you want to add your site:
1. In Cloudflare dashboard, click **"Add a Site"**
2. Enter your domain: `chinacoastcommunity.org.hk`
3. Follow the setup instructions (or skip if you just want Turnstile)

## Step 3: Get Turnstile Site Keys

1. **Go to Turnstile Dashboard**
   - In Cloudflare dashboard, navigate to **"Turnstile"** in the sidebar
   - Or go directly to: https://dash.cloudflare.com/?to=/:account/turnstile

2. **Create a New Site**
   - Click **"Add Site"** button
   - **Site name**: `China Coast Community Forms` (or any name)
   - **Domain**: Enter your domain(s):
     - `chinacoastcommunity.org.hk`
     - `*.chinacoastcommunity.org.hk` (for all subdomains)
   - **Widget mode**: Select **"Managed"** (recommended - invisible for most users)
   - Click **"Create"**

3. **Copy Your Keys**
   - After creating the site, you'll see:
     - **Site Key** (public) - This goes in your frontend
     - **Secret Key** (private) - This goes in your backend/API

## Step 4: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project: https://vercel.com/dashboard
   - Select the **CCC-redesign** project

2. **Open Settings**
   - Click **"Settings"** in the top navigation
   - Click **"Environment Variables"** in the sidebar

3. **Add VITE_TURNSTILE_SITE_KEY**
   - Click **"Add New"**
   - **Key**: `VITE_TURNSTILE_SITE_KEY`
   - **Value**: Paste your **Site Key** from Cloudflare (the public one)
   - **Environments**: Select all (Production, Preview, Development)
   - Click **"Save"**

4. **Add TURNSTILE_SECRET_KEY**
   - Click **"Add New"** again
   - **Key**: `TURNSTILE_SECRET_KEY`
   - **Value**: Paste your **Secret Key** from Cloudflare (the private one)
   - **Environments**: Select all (Production, Preview, Development)
   - Click **"Save"**

5. **Redeploy**
   - After adding environment variables, you need to redeploy:
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger a new deployment

## Step 5: Local Development Setup

For local development, add these to your `.env.local` file:

```bash
VITE_TURNSTILE_SITE_KEY=your_site_key_here
TURNSTILE_SECRET_KEY=your_secret_key_here
```

**Important**: Never commit `.env.local` to git - it should already be in `.gitignore`.

## Step 6: Test the Integration

1. **Submit a Test Form**
   - Go to your website's contact page
   - Fill out and submit the contact form
   - You should see the Turnstile widget (or it may be invisible if using "Managed" mode)

2. **Verify It Works**
   - If CAPTCHA is configured correctly, the form should submit successfully
   - If CAPTCHA is missing or invalid, you'll see an error message
   - Check Vercel function logs for any CAPTCHA-related errors

## How It Works

- **Frontend**: The Turnstile widget appears on the form (usually invisible or minimal)
- **User Interaction**: Most users won't see anything (invisible mode), but bots will be challenged
- **Token Generation**: When the user is verified, Turnstile generates a token
- **Form Submission**: The token is sent with the form data to your API
- **Backend Verification**: Your API verifies the token with Cloudflare before processing the submission
- **Protection**: Invalid or missing tokens result in form rejection

## Widget Modes

Cloudflare Turnstile supports different widget modes:

- **Managed** (Recommended): Invisible for most users, only shows challenge for suspicious traffic
- **Non-interactive**: Shows a checkbox but no puzzle
- **Invisible**: Completely invisible, always runs in background

The current implementation uses "Managed" mode by default, which provides the best user experience.

## Troubleshooting

### CAPTCHA Not Showing

1. **Check Environment Variables**
   - Verify `VITE_TURNSTILE_SITE_KEY` is set in Vercel
   - Make sure you redeployed after adding it

2. **Check Browser Console**
   - Open browser DevTools → Console
   - Look for Turnstile-related errors

3. **Verify Domain**
   - In Cloudflare Turnstile dashboard, ensure your domain is listed
   - Make sure you added both the root domain and any subdomains you're using

### Form Rejected with "CAPTCHA verification failed"

1. **Check Secret Key**
   - Verify `TURNSTILE_SECRET_KEY` is set in Vercel
   - Make sure it's the **Secret Key**, not the Site Key

2. **Check Logs**
   - In Vercel dashboard → Functions → Logs
   - Look for `[Turnstile]` log entries
   - Check for verification errors

3. **Test Token Manually**
   - You can test token verification using Cloudflare's API directly

### CAPTCHA Shows for All Users

- This is normal for "Managed" mode - Cloudflare may show challenges for:
  - New visitors
  - Suspicious traffic patterns
  - High-risk IP addresses
- Most legitimate users will see an invisible CAPTCHA

## Security Notes

- **Never expose your Secret Key** - It should only be in backend environment variables
- **Site Key is safe** - It's meant to be public (in your frontend code)
- **Token Validation** - Always validate tokens on the backend, never trust frontend-only validation
- **Rate Limiting** - Consider adding additional rate limiting for extra protection

## Free Tier Limits

Cloudflare Turnstile is **completely free** with:
- ✅ Unlimited requests
- ✅ No usage limits
- ✅ No credit card required
- ✅ All features included

## Additional Resources

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
- [Turnstile API Reference](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
