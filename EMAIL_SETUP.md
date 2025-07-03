# EmailJS Setup Guide for SMOOTHIE Contact Form

The contact form is configured to send emails directly to `jinl@tongji.edu.cn` using EmailJS. Follow these steps to set it up:

## 1. Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. Note the **Service ID** (you'll need this later)

## 3. Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template content:

```
Subject: SMOOTHIE Contact Form: {{subject}}

You have received a new message through the SMOOTHIE website contact form:

From: {{from_name}}
Email: {{from_email}}
Affiliation: {{affiliation}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent through the SMOOTHIE website contact form.
```

4. Save the template and note the **Template ID**

## 4. Configure the Website

1. Open `script.js`
2. Replace the placeholders with your actual values:

```javascript
// Replace 'YOUR_PUBLIC_KEY' with your EmailJS public key
emailjs.init('YOUR_ACTUAL_PUBLIC_KEY');

// Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID'
emailjs.send('YOUR_ACTUAL_SERVICE_ID', 'YOUR_ACTUAL_TEMPLATE_ID', templateParams)
```

## 5. Find Your Keys

### Public Key:
- Go to **Account** → **General** in your EmailJS dashboard
- Copy the **Public Key**

### Service ID:
- Go to **Email Services**
- Copy the ID of the service you created

### Template ID:
- Go to **Email Templates**
- Copy the ID of the template you created

## 6. Test the Setup

1. Open the contact form on your website
2. Fill in all required fields
3. Submit the form
4. Check if the email arrives at `jinl@tongji.edu.cn`

## 7. Fallback Option

If EmailJS fails to load or send emails, the form will automatically fall back to opening the user's default email client with a pre-filled email to `jinl@tongji.edu.cn`.

## Example Configuration

After setup, your `script.js` should look like this:

```javascript
initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('user_1a2b3c4d5e6f7g8h'); // Your actual public key
    }
}

// In submitContactForm method:
emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

## Troubleshooting

- **Emails not sending**: Check your service connection in EmailJS dashboard
- **Template not found**: Verify template ID is correct
- **Access denied**: Ensure your public key is correct
- **Rate limits**: EmailJS free plan has monthly limits

## Security Note

- The public key is safe to expose in client-side code
- Never put private keys in client-side JavaScript
- EmailJS handles the secure email sending

Once configured, all contact form submissions will be sent directly to Jin Lei's email address at `jinl@tongji.edu.cn`.