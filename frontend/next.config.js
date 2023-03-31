/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      'm.media-amazon.com',
      'www.amazon.ca',
      's3stack-mybucketf68f3ff0-l6prx12lvgew.s3.ca-central-1.amazonaws.com',
      'www.bing.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
