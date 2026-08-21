export function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
}

export function getCurrentUserId() {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.user_id ?? null;
}

export function isCurrentUserSuperuser() {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  if (!token) return false;
  const payload = parseJwt(token);
  return Boolean(payload?.is_superuser);
}