import type { Response } from 'express';
import type { ApiResponse } from './types/apiResponse';

const jwt = require('jsonwebtoken');
const Str = require('@supercharge/strings');
require('dotenv').config();
const pwStrength = /^(?=.*[A-Za-z])(?=.*\d)[\S]{6,}$/; // mindestens 6 Stellen && eine Zahl && ein Buchstabe
const nodemailer = require('nodemailer');

export const testPasswordStrength = (password: string) => pwStrength.test(password);

export const createJWT = (id: number, email: string, username: string, communities: number[]) =>
  jwt.sign({ version: 4, user: { id, email, username, communities } }, process.env.JWT_SECRET, {
    expiresIn: '1y',
  });

export const generateRandomString = () => Str.random(90);

export const generateCommunityInviteCode = () =>
  Math.floor(Math.random() * (999999 - 100000)) + 100000;

export function sendVerifyEmail(email: string, subject: string, url: string) {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: process.env.MY_EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD_EMAIL,
    },
  });

  // Wrap in an async IIFE so we can use await.
  (async () => {
    const info = await transporter.sendMail({
      from: `"Together" <${process.env.MY_EMAIL}>`,
      to: email,
      subject,
      html: `<a href=${url}>Verify</a>`, // HTML body
    });

    console.log('Message sent:', info.messageId);
  })();
}

export enum ResStatus {
  OK = 'OK',
  ERROR = 'Error',
}

export function resSend<T = undefined>(
  res: Response,
  data: T | null,
  status = ResStatus.OK,
  error?: string,
  httpStatusCode = 200,
) {
  const response: ApiResponse<T> = {
    status: status,
    data: (data ?? {}) as T,
    error: error,
  };

  res.status(httpStatusCode).json(response);
}
