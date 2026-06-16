/**
 * Base path the site is served from. On GitHub Pages the project lives under
 * "/Dev-Sharma-v2"; locally it's served from the root. Keep this in sync with
 * `basePath` in next.config.ts. Use it to prefix static assets in `public/`
 * (raw <img>/<video> src values are NOT auto-prefixed in static export).
 */
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/Dev-Sharma-v2" : "";

/** Prefix a public-folder asset path with the active base path. */
export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
