/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
<<<<<<< HEAD
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.jp' }],
=======
>>>>>>> a4f3fe7f35dabc5fd211d2655a2fd781e7918935
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.jp' },
      { protocol: 'https', hostname: 'images.microcms-assets.io' },
    ],
  },
};

export default nextConfig;
