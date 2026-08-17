import { API_URL } from '@/shared/config/apiUrl';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function memberApi(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body: options.body === undefined || typeof options.body === 'string'
      ? options.body
      : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(data?.error || `Request failed (${response.status})`, response.status);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function placePath(placeType, placeId) {
  return placeType === 'attraction'
    ? `/location/${placeId}`
    : `/theme/${placeType}/${placeId}`;
}
