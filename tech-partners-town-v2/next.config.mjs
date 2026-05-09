/**
 * GitHub Pages 用に静的書き出しモードへ切り替えるかどうかを環境変数で判定。
 * - GITHUB_PAGES=1 のとき: output:'export' + basePath を有効化
 * - 通常時 (Vercel やローカル開発): 通常の Next.js モード
 *
 * これにより Vercel は何も変更せずに動作し、GitHub Pages 用ビルドだけ
 * 静的書き出しになる。
 */
const isGithubPages = process.env.GITHUB_PAGES === "1";
const repoBase = "/jisedai-homepage/tech-partners-town-v2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader"],
    });
    return config;
  },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: repoBase,
        assetPrefix: repoBase,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
