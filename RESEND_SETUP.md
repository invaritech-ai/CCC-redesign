# Resend Email Setup Instructions

This guide will help you set up Resend to send email notifications when the contact form is submitted.

## Prerequisites

- Access to your Resend account (already have this)
- Access to your domain's DNS settings (for domain verification)
- Access to Vercel project settings (for environment variables)

## Step 1: Verify Your Domain in Resend

1. **Log in to Resend Dashboard**
   - Go to https://resend.com and log in
   - Navigate to **"Domains"** in the sidebar

2. **Add Your Domain**
   - Click **"Add Domain"**
   - Enter your domain: `invaritech.ai` (your verified domain)
   - Click **"Add"**
   - **Note**: Your verified domain is `notifications.invaritech.ai`, so you can send from any address on `invaritech.ai` or `notifications.invaritech.ai`

3. **Add DNS Records**
   - Resend will provide you with DNS records to add:
     - **TXT record** (for domain verification)
     - **DKIM records** (for email authentication)
   - Copy these records

4. **Update Your DNS**
   - Log in to your domain registrar or DNS provider
   - Add the TXT and DKIM records provided by Resend
   - Save the changes

5. **Wait for Verification**
   - Return to Resend dashboard
   - Wait a few minutes for DNS propagation
   - The domain status should change to **"Verified"** (green checkmark)

## Step 2: Create API Key

1. **Navigate to API Keys**
   - In Resend dashboard, go to **"API Keys"** in the sidebar
   - Click **"Create API Key"**

2. **Configure API Key**
   - **Name**: `CCC Form Submissions` (or any descriptive name)
   - **Permission**: Select **"Sending access"**
   - Click **"Create"**

3. **Copy the API Key**
   - **Important**: Copy the API key immediately - you won't be able to see it again!
   - It will look like: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project: https://vercel.com/dashboard
   - Select the **CCC-redesign** project

2. **Open Settings**
   - Click **"Settings"** in the top navigation
   - Click **"Environment Variables"** in the sidebar

3. **Add RESEND_API_KEY**
   - Click **"Add New"**
   - **Key**: `RESEND_API_KEY`
   - **Value**: Paste your Resend API key (from Step 2)
   - **Environments**: Select all (Production, Preview, Development)
   - Click **"Save"**

4. **Add RESEND_FROM_EMAIL (Optional)**
   - If you want to customize the sender email:
   - **Key**: `RESEND_FROM_EMAIL`
   - **Value**: `notifications@invaritech.ai` (must be on your verified domain)
   - **Environments**: Select all
   - Click **"Save"**
   - **Note**: If not set, defaults to `notifications@invaritech.ai`

5. **Add RESEND_TO_EMAIL (Optional)**
   - If you want to change the recipient email:
   - **Key**: `RESEND_TO_EMAIL`
   - **Value**: `community@biznetvigator.com`
   - **Environments**: Select all
   - Click **"Save"**
   - **Note**: If not set, defaults to `community@biznetvigator.com`

6. **Redeploy**
   - After adding environment variables, you need to redeploy:
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger a new deployment

## Step 4: Install Dependencies

The `resend` package has been added to `package.json`. You need to install it:

Run the following command from the project root:

```bash
npm install
```

This will install the `resend` package locally. For Vercel deployments, dependencies are automatically installed during build.

## Step 5: Test the Integration

1. **Submit a Test Form**
   - Go to your website's contact page
   - Fill out and submit the contact form
   - Check that the form submission succeeds

2. **Check Email Delivery**
   - Check the inbox for `community@biznetvigator.com`
   - You should receive an email with:
     - **Subject**: `New form submission: [Form Name]`
     - **From**: `notifications@invaritech.ai` (or your custom sender)
     - **Body**: All form fields listed in a readable format

3. **Check Logs (if email doesn't arrive)**
   - In Vercel dashboard, go to **"Functions"** → **"Logs"**
   - Look for `[Email]` log entries
   - Check for any error messages

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables**
   - Verify `RESEND_API_KEY` is set in Vercel
   - Make sure you redeployed after adding the variable

2. **Check Domain Verification**
   - In Resend dashboard, verify domain shows as "Verified"
   - If not verified, check DNS records are correct

3. **Check API Key**
   - Verify the API key has "Sending access" permission
   - Try creating a new API key if needed

4. **Check Logs**
   - Look for `[Email]` entries in Vercel function logs
   - Check for error messages

### Email Goes to Spam

- Make sure DKIM records are properly configured
- Verify the sender domain is fully verified in Resend
- Consider adding SPF records (Resend may provide these)

### Form Submission Works But No Email

- Check that the form name contains "contact" (case-insensitive)
- The email function only triggers for contact forms
- Check Vercel logs for `[Email]` entries to see what's happening

## How It Works

- When a contact form is submitted:
  1. Form data is saved to Google Sheets (existing functionality)
  2. Files are uploaded to Vercel Blob (if any)
  3. **NEW**: Email notification is sent via Resend to `community@biznetvigator.com`
  4. Form submission succeeds even if email fails (graceful degradation)

- Email includes:
  - Form name
  - Submission timestamp
  - All form fields and their values
  - File download links (if files were uploaded)

## Free Tier Limits

Resend free tier provides:
- **100 emails per day**
- **3,000 emails per month**

This is more than sufficient for contact form submissions.
