export function localRedirectPath(raw: string | undefined): string | null {
  if (!raw) {
    return null
  }
  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw
  }
  try {
    const url = new URL(raw)
    return url.pathname + url.search
  } catch {
    return null
  }
}