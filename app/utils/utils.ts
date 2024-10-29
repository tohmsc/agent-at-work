type RedirectStatus = "success" | "error";

export function encodedRedirect(status: RedirectStatus, path: string, message: string) {
  const params = new URLSearchParams({ status, message });
  return `${path}?${params.toString()}`;
} 