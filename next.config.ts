import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: generateCSP(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

function generateCSP() {
  const isDev = process.env.NODE_ENV !== 'production';

  const policy = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      isDev ? "'unsafe-eval'" : '',
      "https://js.hcaptcha.com",
      "https://hcaptcha.com",
      "https://*.hcaptcha.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      "https://hcaptcha.com",
      "https://*.hcaptcha.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "blob:",
      "https://*.supabase.co",
      "https://*.hcaptcha.com"
    ],
    'connect-src': [
      "'self'",
      "https://*.supabase.co",
      "https://*.hcaptcha.com",
      "https://hcaptcha.com"
    ],
    'frame-src': [
      "'self'",
      "https://*.hcaptcha.com",
      "https://hcaptcha.com"
    ],
    'font-src': [
      "'self'",
      "data:"
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"]
  };

  return Object.entries(policy)
    .map(([key, values]) => {
      const filteredValues = values.filter(v => v !== '');
      if (filteredValues.length > 0) {
        return `${key} ${filteredValues.join(' ')}`;
      }
      return '';
    })
    .join('; ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}