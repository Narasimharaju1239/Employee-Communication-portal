// --- OTP for Signup ---
// ...existing code...
// ...existing code...
import { sendGenericEmail } from '../utils/email.js';

export const sendSignupOtp = async (req, res) => {
  const { email, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP and expiry in a temp user doc (or upsert)
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, role: 'Employee', status: 'pending' });
    }
    user.signupOtp = otp;
    user.signupOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    // Send OTP email
    const subject = 'INCOR: Your Signup OTP';
    const message = `<p>Your OTP for signup is:</p><div style="margin:24px 0;"><span style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;font-weight:600;font-size:22px;letter-spacing:2px;">${otp}</span></div><p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>`;
    await sendGenericEmail(email, subject, message, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Signup OTP Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const verifySignupOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, signupOtp: otp, signupOtpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.signupOtp = undefined;
    user.signupOtpExpires = undefined;
    user.isOtpVerified = true;
    await user.save();
    res.json({ message: 'OTP verified. You can now set your password.' });
  } catch (err) {
    console.error('Verify Signup OTP Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Image upload controller
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const userId = req.user._id;
    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(userId, { imageUrl }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Image uploaded', imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Get Profile Controller
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Change Password Controller
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send notification email
    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await user.save();
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      await sendResetEmail(
        user.email,
        resetLink,
        'Your password was changed',
        `<p>Your password was just changed. If you did not perform this action, please contact INCOR support immediately.</p><p>You can reset your password using the following link: <a href="${resetLink}">Reset Password</a> (valid for 5 minutes).</p>`
      );
    } catch (emailErr) {
      console.error('Failed to send password change notification email:', emailErr);
    }

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// server/controllers/authController.js
import User from '../models/User.js';
import Booking from '../models/Booking.js'; // <-- import Booking model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// ...existing code...
import { verifyCaptcha } from '../utils/verifyCaptcha.js';

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // Only allow signup if OTP was verified
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ msg: 'OTP not verified for this email. Please verify OTP first.' });
    }
    if (user.password) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user.name = name;
    user.password = await bcrypt.hash(password, 10);
    user.isOtpVerified = undefined;
    await user.save();
    // Send welcome email
    try {
      const subject = 'Welcome to INCOR!';
      const message = [
        `Dear ${user.name || user.email},`,
        '',
        'Welcome to INCOR! Your account has been created successfully.',
        '',
        'You can now log in and start using the platform.',
        '',
        'If you have any questions, please contact support.',
        '',
        'Best regards,',
        'INCOR Team'
      ].map(line => `<div>${line}</div>`).join('');
      await sendGenericEmail(user.email, subject, message, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
    } catch (mailErr) {
      console.error('Failed to send welcome email:', mailErr);
    }
    res.status(201).json({ msg: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name')
      .populate('bookedBy', 'email name role'); // <-- role added here

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Forgot Password
// Send password reset link (for Forgot Password page)
export const forgotPasswordLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();
    // Send reset link email
    const subject = 'INCOR: Password Reset Link';
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    const message = `<p>Click the button below to reset your password:</p><div style="margin:24px 0;"><a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:500;font-size:16px;">Reset Password</a></div><p>This link is valid for 15 minutes. If you did not request this, please ignore this email.</p>`;
    await sendGenericEmail(email, subject, message, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('Forgot Password Link Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    // Send OTP email
    const subject = 'INCOR: Your Password Reset OTP';
    const message = `<p>Your OTP for password reset is:</p><div style="margin:24px 0;"><span style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;font-weight:600;font-size:22px;letter-spacing:2px;">${otp}</span></div><p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>`;
    await sendGenericEmail(email, subject, message, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, token, newPassword } = req.body;
  try {
    let user = null;
    if (otp && email) {
      user = await User.findOne({ email, resetPasswordOtp: otp, resetPasswordOtpExpires: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;
      await user.save();
    } else if (token) {
      user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset link' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    } else {
      return res.status(400).json({ message: 'Missing OTP or token for password reset' });
    }
    // Send notification email after password reset
    try {
      const loginLink = process.env.FRONTEND_URL || 'http://localhost:3000/login';
      const mailSubject = 'INCOR: Your password was changed';
      const mailHtml = `<p>Your password was just changed using the password reset process. If you did not perform this action, please contact INCOR support immediately.</p><p>You can <a href="${loginLink}">login here</a>.</p>`;
      await sendGenericEmail(user.email, mailSubject, mailHtml, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>`, buttonUrl: loginLink, buttonText: 'Login' });
    } catch (emailErr) {
      console.error('[DEBUG] Failed to send password reset notification email:', emailErr);
    }
    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
