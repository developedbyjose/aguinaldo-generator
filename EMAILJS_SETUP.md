# EmailJS Setup Guide

This guide will help you configure EmailJS to receive email notifications when users claim their aguinaldo rewards.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. After logging in, go to **"Email Services"** in the dashboard
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook** / **Yahoo** / **Custom SMTP**
4. Follow the authentication steps
5. Copy your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **"Email Templates"** in the dashboard
2. Click **"Create New Template"**
3. Use this template structure:

### Template Content:

**Subject:**
```
🎁 New Aguinaldo Claim - ₱{{reward_amount}}
```

**Body:**
```
Hi {{to_name}},

Someone just claimed their aguinaldo reward!

📋 CLAIM DETAILS:
━━━━━━━━━━━━━━━━━━━━
Name: {{from_name}}
GCash Number: {{gcash_number}}
Reward Amount: ₱{{reward_amount}}
Status: {{is_godchild}}
Card Selected: #{{card_index}}
Claimed At: {{timestamp}}

💸 ACTION REQUIRED:
Send ₱{{reward_amount}} via GCash to {{gcash_number}}

━━━━━━━━━━━━━━━━━━━━
Sent from Aguinaldo Generator
```

4. Click **"Save"**
5. Copy your **Template ID** (e.g., `template_xyz789`)

### Template Variables Used:
- `{{to_name}}` - Your name (recipient)
- `{{from_name}}` - Claimer's name
- `{{gcash_number}}` - GCash number to send payment to
- `{{reward_amount}}` - Amount to send (₱500-1000 or ₱50-200)
- `{{is_godchild}}` - Whether they're a godchild or guest
- `{{timestamp}}` - When claim was made
- `{{card_index}}` - Which card they selected (1-6)

## Step 4: Get Public Key

1. Go to **"Account"** → **"General"** in the dashboard
2. Find your **Public Key** (e.g., `YOUR_PUBLIC_KEY_HERE`)
3. Copy this key

## Step 5: Create .env File

1. In the project root directory, create a file named `.env`
2. Add your credentials:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VITE_RECIPIENT_EMAIL=your_email@gmail.com
```

**Important:** Replace the values with your actual credentials from EmailJS.

## Step 6: Test Locally

1. Start the development server:
```bash
npm run dev
```

2. Open the app in your browser
3. Answer the godchild prompt with test data:
   - Name: `Test User`
   - GCash: `09171234567`
   - Click "Yes" or "No" for godchild
4. Select a card
5. Click **"Claim from ninong"**
6. You should see "Sending notification..." toast
7. Check your email inbox for the notification

### Expected Behavior:
- ✅ Toast shows "Sending notification..." (2 seconds)
- ✅ Toast shows "Claim submitted successfully!" (4 seconds)
- ✅ Email arrives in your inbox within 1-2 minutes
- ✅ Email contains all claim details

### If Email Fails:
- ❌ Toast shows "Notification failed" error
- ✅ Claim is still saved in localStorage (no data loss)
- Check browser console for error details
- Verify your `.env` credentials are correct

## Step 7: Deploy to Production

### For Vercel:
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_RECIPIENT_EMAIL`
4. Redeploy your app

### For Netlify:
1. Go to your Netlify site dashboard
2. Click **"Site settings"** → **"Environment variables"**
3. Add each variable (same as above)
4. Trigger a new deploy

## Troubleshooting

### Email Not Received?

**Check 1: Verify Environment Variables**
```bash
# In browser console, run:
console.log(import.meta.env.VITE_EMAILJS_SERVICE_ID)
```
- Should show your Service ID (not `undefined`)
- If `undefined`, check your `.env` file

**Check 2: EmailJS Dashboard**
1. Go to EmailJS dashboard → **"Email History"**
2. Check if email was sent successfully
3. Look for error messages

**Check 3: Email Service Status**
1. Go to **"Email Services"** in EmailJS dashboard
2. Make sure your service is **"Connected"** (green dot)
3. Try reconnecting if it shows as disconnected

**Check 4: Spam Folder**
- Check your spam/junk folder
- Mark emails from EmailJS as "Not Spam"

**Check 5: Rate Limiting**
- EmailJS free tier: 200 emails/month
- If exceeded, upgrade your plan or wait for next month

### Console Errors?

**Error: "EmailJS public key not configured"**
- Your `.env` file is missing or not loaded
- Make sure file is named exactly `.env` (not `.env.txt`)
- Restart dev server after creating `.env`

**Error: "EmailJS not configured. Check environment variables."**
- Service ID or Template ID is missing from `.env`
- Check for typos in variable names (must start with `VITE_`)

**Error: "Failed to send email"**
- Check your internet connection
- Verify credentials are correct
- Check EmailJS service status

## Security Notes

✅ **Safe to Expose:**
- Public Key (designed for client-side use)
- Service ID and Template ID (public identifiers)
- These are committed in your build and are meant to be public

⚠️ **Keep Private:**
- `.env` file itself (in `.gitignore`)
- EmailJS account password

🔒 **EmailJS Security Features:**
- **Rate limiting:** Prevents spam (200 emails/month on free tier)
- **Domain whitelisting:** Restrict to your domain in EmailJS settings
- **reCAPTCHA:** Can be added for bot protection (optional)

## Email Template Customization

Want to customize the email format? Edit the template in EmailJS dashboard:

### Add Company Logo:
```html
<img src="https://your-domain.com/logo.png" alt="Logo" style="width: 100px;">
```

### Add Styling:
```html
<div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
  <h2 style="color: #2c5282;">New Claim Received!</h2>
  <p><strong>Name:</strong> {{from_name}}</p>
  <!-- rest of template -->
</div>
```

### Add Auto-Reply to User:
1. Create a second template for user confirmation
2. Use their email instead of admin email
3. Modify `onSendToTito` to send both emails

## Cost Information

**EmailJS Free Tier:**
- 200 emails/month
- 2 email services
- Unlimited templates
- Community support

**Paid Plans (if needed):**
- Personal: $10/month (1,000 emails)
- Professional: $35/month (5,000 emails)
- Enterprise: Custom pricing

For this use case, the free tier should be sufficient unless you have more than 200 claims per month.

## Support

If you encounter issues:
1. Check the [EmailJS Documentation](https://www.emailjs.com/docs/)
2. Review the browser console for error messages
3. Check EmailJS dashboard for email history and errors
4. Contact EmailJS support through their dashboard

## Next Steps

After setup is complete:
- ✅ Test with multiple claims
- ✅ Verify email formatting looks good
- ✅ Test error handling (try with invalid credentials)
- ✅ Deploy to production
- ✅ Add production environment variables
- ✅ Monitor EmailJS usage in dashboard
