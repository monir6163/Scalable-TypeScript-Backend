import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
   host: config.smtp.host,
   port: config.smtp.port,
   secure: config.smtp.secure === 'true' ? true : false,
   tls: {
      rejectUnauthorized: false,
   },
   auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
   },
});

export const sendVerificationLink = async (
   to: string,
   subject: string,
   token: string
) => {
   const verificationUrl = `${config.cors_origin}/verify-email?token=${token}`;
   await transporter.sendMail({
      from: config.smtp.from_email,
      to,
      subject: subject || 'Email Verification',
      html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
   });
};

export const sendVerificationCode = async (
   to: string,
   subject: string,
   code: string
) => {
   await transporter.sendMail({
      from: config.smtp.from_email,
      to,
      subject: subject || 'Verification Code',
      html: `
      <h2>Verification Code</h2>
      <p>Your code is: <strong>${code}</strong></p>
      <p>This code is valid for 10 minutes.</p>
    `,
   });
};
