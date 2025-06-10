export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return `http://${host}:4000`;
  }

  return "http://localhost:4000";
}
