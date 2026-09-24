# ST.IPS administrator access

The staff portal is available at `/admin`. Admin accounts are created from the backend and are never seeded with a public default password.

1. In `backend/.env`, set a unique `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` (at least 12 characters). Keep this file private and out of source control.
2. From the `backend` folder, run `npm run admin:create` once. Running it again for the same email securely replaces that account's password.
3. Start the API with `npm start`, then sign in at `/admin`.

For image uploads, create a Cloudinary account and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `backend/.env`. The secret stays on the backend; the admin upload flow requests a short-lived signed upload. See `.env.example` for the complete variable list.

The admissions inbox requires the API and MongoDB connection to be running. Set `VITE_API_URL` for the frontend when the API is hosted somewhere other than `http://localhost:5000/api`.
