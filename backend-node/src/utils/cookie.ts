import { CookieOptions } from "express";

export const COOKIE_OPTIONS : CookieOptions = {
  httpOnly: true,
  // secure: process.env.NODE_ENV === 'production',
  secure: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000
}