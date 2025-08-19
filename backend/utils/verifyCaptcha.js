import axios from 'axios';

export async function verifyCaptcha(token) {
  // Replace with your Google reCAPTCHA secret key
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) throw new Error('reCAPTCHA secret not set');
  const url = 'https://www.google.com/recaptcha/api/siteverify';
  const response = await axios.post(url, null, {
    params: { secret, response: token }
  });
  return response.data.success;
}
