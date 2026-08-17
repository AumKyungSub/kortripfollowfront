const developmentApiUrl = `${window.location.protocol}//${window.location.hostname}:3000`;

export const API_URL = import.meta.env.DEV
  ? developmentApiUrl
  : import.meta.env.VITE_API_URL;
