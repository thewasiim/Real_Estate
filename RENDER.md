# Render deployment

Deploy the root `render.yaml` as a Blueprint, or mirror its settings in the Render dashboard.

Set the frontend build-time variable `VITE_API_BASE_URL` to the public backend service origin, for example `https://your-api.onrender.com`. The Axios client appends exactly one `/api`; it also accepts a value that already ends in `/api`.

Set backend `CORS_ORIGIN` to the exact static-site origin (without a trailing slash). Use commas for additional approved origins, for example `https://your-site.onrender.com,https://www.example.com`. Do not use `*` when cookie credentials are enabled.

Set backend `DATABASE_URL` and a strong `JWT_SECRET` in Render. After changing `VITE_API_BASE_URL`, trigger a frontend rebuild because Vite embeds it at build time.
