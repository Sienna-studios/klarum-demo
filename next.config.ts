import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // `?photos=0` serves the same pages without photos (app/np/*), so the baseline stays fully static.
  async rewrites() {
    const has = [{ type: "query" as const, key: "photos", value: "0" }];
    return {
      beforeFiles: [
        { source: "/", has, destination: "/np" },
        { source: "/v2", has, destination: "/np/v2" },
        { source: "/v2/:hero", has, destination: "/np/v2/:hero" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default config;
