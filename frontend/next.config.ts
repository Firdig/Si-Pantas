import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Izinkan akses dev lewat terowongan ngrok (dipakai untuk cek dari HP).
  // Domain ngrok gratis berubah setiap sesi, jadi pakai wildcard.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // /kontak isinya sama dengan /bantuan, jadi disatukan. 307 (sementara)
  // dipakai agar mudah diubah lagi tanpa terlanjur tersimpan di cache browser.
  async redirects() {
    return [
      {
        source: "/kontak",
        destination: "/bantuan",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
