import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "libasgallery.com" },
      { hostname: "aminselected.pk" },
      { hostname: "www.ethnic.com.pk" },
      { hostname: "abuhurairahfabrics.com" },
      { hostname: "www.nameerabyfarooq.com" },
      { hostname: "theworldofhsy.com" },
      { hostname: "i0.wp.com" },
      { hostname: "s.alicdn.com" },
      { hostname: "i.pinimg.com" },
      { hostname: "www.ismailfarid.com" },
      { hostname: "i.etsystatic.com" },
      { hostname: "successmenswear.com" },
    ],
  },
};

export default nextConfig;
