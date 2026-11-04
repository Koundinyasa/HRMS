// One place for the backend address, so every API caller uses the same one.
// Set VITE_API_URL in frontend/.env (for example https://hrms.example.com/api).
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
).replace(/\/+$/, '');
