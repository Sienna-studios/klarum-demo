import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // `?photos=0` serves the same pages without photos (app/np/*), so the baseline stays fully static.
  // the light page is hero C only now: the old hero routes land on /v2
  async redirects() {
    return [{ source: "/v2/:hero(c|e|f|g)", destination: "/v2", permanent: false }];
  },
  async rewrites() {
    const has = [{ type: "query" as const, key: "photos", value: "0" }];
    return {
      beforeFiles: [
        { source: "/", has, destination: "/np" },
        { source: "/v2", has, destination: "/np/v2" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default config;
