import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '-Nu-Med-Arena';
const repo = isGithubActions ? `/${repositoryName}` : '';

const nextConfig = {
  output: isGithubActions ? 'export' : undefined,
  trailingSlash: true,
  basePath: isGithubActions ? repo : '',
  assetPrefix: isGithubActions ? `${repo}/` : undefined,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? repo : '',
  },
  transpilePackages: ['@nucmed/shared'],
};

export default nextConfig;
