/**
 * Helper to resolve static asset paths correctly across local dev and GitHub Pages base paths.
 */
export function getAssetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
