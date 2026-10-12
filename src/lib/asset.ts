/** Prefix for files in /public when the site is served from a sub-path (e.g. /v2). Empty at the root. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;
