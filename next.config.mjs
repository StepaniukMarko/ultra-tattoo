/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { dev }) => {
    // Workarounds for Windows paths containing spaces ("Stepaniuk Mark"):
    // webpack's realpath/readlink + persistent FS cache both choke on the space.
    config.resolve.symlinks = false;
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
