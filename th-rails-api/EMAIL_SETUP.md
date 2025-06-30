# Email Setup Guide for TaskHub

This guide will help you configure SMTP email delivery for your TaskHub Rails API.

## Quick Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Choose your email provider and configure the settings in your `.env` file

3. Restart your Rails server to load the new configuration

## Email Provider Configurations

### 1. Gmail (Recommended for Development)

**Prerequisites:**
- Gmail account
- Enable 2-Factor Authentication
- Generate an App Password

**Steps:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use these settings in your `.env` file:

```env
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_DOMAIN=gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-generated-app-password
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

### 2. SendGrid (Recommended for Production)

**Prerequisites:**
- SendGrid account (free tier available)
- API Key

**Steps:**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Go to Settings → API Keys
3. Create a new API Key with "Mail Send" permissions
4. Use these settings:

```env
SMTP_ADDRESS=smtp.sendgrid.net
SMTP_PORT=587
SMTP_DOMAIN=yourdomain.com
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

### 3. Mailgun

**Prerequisites:**
- Mailgun account
- Domain verification (for production)

**Steps:**
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Go to Domains → Select your domain → SMTP credentials
3. Use these settings:

```env
SMTP_ADDRESS=smtp.mailgun.org
SMTP_PORT=587
SMTP_DOMAIN=yourdomain.com
SMTP_USERNAME=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

### 4. Amazon SES

**Prerequisites:**
- AWS account
- SES setup and domain verification

**Steps:**
1. Set up Amazon SES in AWS Console
2. Create SMTP credentials
3. Use these settings:

```env
SMTP_ADDRESS=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_DOMAIN=yourdomain.com
SMTP_USERNAME=your-ses-username
SMTP_PASSWORD=your-ses-password
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

## Testing Email Delivery

### 1. Test via Rails Console

```ruby
# Start Rails console
rails console

# Test email delivery
UserMailer.email_verification("test@example.com", "test-token").deliver_now
```

### 2. Test via API Endpoint

```bash
# Register a new user (this will trigger email verification)
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "username": "testuser", 
      "email": "your-email@example.com", 
      "password": "password123"
    }
  }'
```

### 3. Test Password Reset

```bash
curl -X POST http://localhost:3000/auth/forgot_password \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

## Troubleshooting

### Common Issues

1. **"Net::SMTPAuthenticationError"**
   - Check username/password
   - For Gmail, ensure you're using an App Password, not your regular password
   - Verify 2FA is enabled for Gmail

2. **"Connection timeout"**
   - Check SMTP address and port
   - Verify your firewall/network allows SMTP connections

3. **"Must issue a STARTTLS command first"**
   - Ensure `SMTP_ENABLE_STARTTLS_AUTO=true`
   - Check if your provider requires TLS

4. **Emails going to spam**
   - Set up SPF, DKIM, and DMARC records for your domain
   - Consider using a dedicated email service like SendGrid

### Environment Variables

Make sure these are set in your `.env` file or environment:

```env
SMTP_ADDRESS=your-smtp-server
SMTP_PORT=587
SMTP_DOMAIN=your-domain.com
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
MAILER_HOST=yourdomain.com
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

## Production Considerations

1. **Use environment variables** - Never commit email credentials to version control
2. **Choose a reliable provider** - SendGrid, Mailgun, or Amazon SES are recommended
3. **Set up domain authentication** - Configure SPF, DKIM, and DMARC records
4. **Monitor delivery rates** - Set up webhooks to track bounces and complaints
5. **Handle failures gracefully** - Implement retry logic and error handling

## Email Templates

The system includes two types of email templates:

1. **Email Verification** - Sent when users sign up
2. **Password Reset** - Sent when users request password reset

Both templates are available in HTML and plain text formats for better compatibility.

## Security Notes

- Use App Passwords instead of regular passwords for Gmail
- Store all credentials as environment variables
- Enable STARTTLS for encrypted connections
- Consider rate limiting to prevent abuse
- Regularly rotate API keys and passwords 
