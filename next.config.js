/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "s.gravatar.com",
      "avatars.githubusercontent.com",
      "media.licdn.com",
      "scontent-lga3-1.xx.fbcdn.net",
      "pbs.twimg.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination:
          "https://github.com/robertdavidwest/practice-makes-performer",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
