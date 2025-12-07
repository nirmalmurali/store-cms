import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle CSS files
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    });

    // Handle LESS files
    config.module.rules.push({
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
