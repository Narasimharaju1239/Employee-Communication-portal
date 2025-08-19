import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
  secure: process.env.EMAIL_SECURE === 'true' || !process.env.EMAIL_SECURE, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTestEmail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'SMTP Test Email',
      html: '<p>This is a test email from your INCOR backend SMTP setup.</p>'
    });
    console.log('✅ Test email sent successfully!');
  } catch (err) {
    console.error('❌ Test email failed:', err);
  }
}

sendTestEmail();
