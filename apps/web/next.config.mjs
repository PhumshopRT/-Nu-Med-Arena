import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = '';
if (isGithubActions) {
  repo = '/RTGAME';
}

const nextConfig = {
  output: isGithubActions ? 'export' : undefined,
  trailingSlash: true,
  basePath: isGithubActions ? repo : '',
  assetPrefix: isGithubActions ? `${repo}/` : undefined,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@nucmed/shared'],
};

export default nextConfig;
