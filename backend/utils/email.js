import nodemailer from 'nodemailer';

// Debug email configuration
console.log('Email Config:', {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_SECURE !== 'false',
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '*****' : 'undefined'
});

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE !== 'false',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100
});

const DEFAULT_SENDER = `"INCOR Group" <${process.env.EMAIL_USER}>`;

/**
 * Enhanced email template with modern CSS and animations
 */
function buildEmailTemplate({ subject, message, buttonUrl, buttonText, type, userName, companyName, companyAddress, privacyLink, termsLink, expiryTime }) {
  const year = new Date().getFullYear();
  // Use your actual logo URL here. This should be a direct image path, not a CSS url().
  const logoUrl = '/background.jpg';
  const name = userName || 'User';
  const company = companyName || 'INCOR Group';
  const address = companyAddress || '';
  const privacy = privacyLink || 'https://incor-group.com/privacy';
  const terms = termsLink || 'https://incor-group.com/terms';
  const expiry = expiryTime || '0.25';
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .logo {
            max-width: 150px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #0066ff;
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
        }
        .expiry-note {
            font-style: italic;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="${logoUrl}" alt="Company Logo" class="logo">
        <h2>${subject}</h2>
    </div>
    <div class="content">
        <p>Hello ${name},</p>
        <p>${message}</p>
        ${buttonUrl && buttonText ? `
        <p style="text-align: center;">
            <a href="${buttonUrl}" class="button">${buttonText}</a>
        </p>
        ` : ''}
        ${type === 'reset' ? `
        <p class="expiry-note">This link will expire in ${expiry} hours. If you didn't request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>If the button above doesn't work, copy and paste this link into your browser:</p>
        <p>${buttonUrl}</p>
        ` : ''}
    </div>
    <div class="footer">
        <p>&copy; ${year} ${company}. All rights reserved.</p>
        <p>${address}</p>
        <p>
            <a href="${privacy}">Privacy Policy</a> | 
            <a href="${terms}">Terms of Service</a>
        </p>
    </div>
</body>
</html>
  `;
}

/**
 * Enhanced password reset email with animations
 */
export const sendResetEmail = async (to, resetLink, subject = 'Password Reset Request', html = null) => {
  const uniqueId = `${Date.now()}.${Math.random().toString(36).substring(2)}`;
  
  const defaultHtml = buildEmailTemplate({
    subject,
    message: `
      <p>You've requested to reset your password for your INCOR Group account.</p>
      <p>Please click the button below to set a new secure password:</p>
    `,
    buttonUrl: resetLink,
    buttonText: 'Reset Password',
    type: 'reset'
  });

  const mailOptions = {
    from: DEFAULT_SENDER,
    to,
    subject: `${subject} ${uniqueId}`,
    html: html || defaultHtml,
    headers: {
      'Message-ID': `<${uniqueId}@incor-group>`,
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'High'
    },
    messageId: `<${uniqueId}@incor-group>`
  };

  delete mailOptions.headers['In-Reply-To'];
  delete mailOptions.headers['References'];

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('Failed to send reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Enhanced booking confirmation email
 */
export const sendBookingEmail = async (
  to,
  subject,
  message,
  buttonUrl = null,
  buttonText = null,
  userName = 'User',
  companyName = 'INCOR Group',
  companyAddress = '',
  privacyLink = 'https://incor-group.com/privacy',
  termsLink = 'https://incor-group.com/terms'
) => {
  const uniqueId = `${Date.now()}.${Math.random().toString(36).substring(2)}`;
  const mailOptions = {
    from: DEFAULT_SENDER,
    to,
    subject: `${subject} ${uniqueId}`,
    html: buildEmailTemplate({
      subject,
      message,
      buttonUrl,
      buttonText,
      type: 'booking',
      userName,
      companyName,
      companyAddress,
      privacyLink,
      termsLink
    }),
    headers: {
      'Message-ID': `<${uniqueId}@incor-group>`
    },
    messageId: `<${uniqueId}@incor-group>`
  };
  delete mailOptions.headers['In-Reply-To'];
  delete mailOptions.headers['References'];
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Booking email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('Failed to send booking email:', error);
    throw new Error('Failed to send booking email');
  }
};

/**
 * Enhanced generic email function
 */
export const sendGenericEmail = async (to, subject, message, options = {}) => {
  const uniqueId = `${Date.now()}.${Math.random().toString(36).substring(2)}`;
  
  const mailOptions = {
    from: DEFAULT_SENDER,
    to,
    subject: `${subject} ${uniqueId}`,
    html: buildEmailTemplate({
      subject,
      message,
      buttonUrl: options.buttonUrl,
      buttonText: options.buttonText
    }),
    headers: {
      'Message-ID': `<${uniqueId}@incor-group>`
    },
    messageId: `<${uniqueId}@incor-group>`
  };

  delete mailOptions.headers['In-Reply-To'];
  delete mailOptions.headers['References'];
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Generic email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('Failed to send generic email:', error);
    throw new Error('Failed to send email');
  }
};