Development notes

1. Start MongoDB and ensure `MONGO_URI` is set in `.env`.
2. Install deps: `npm install`
3. Start server: `npm start` (uses nodemon)
4. Watch server console for `Auth header received:` logs when making authenticated requests.

If you get 401 on `/api/cart`:

- Ensure you are logged in and `localStorage.authToken` exists in the browser.
- Ensure frontend uses `VITE_API_URL` or `http://localhost:4000/api` as base.
- Check server console for `Auth header received:` to see if token reached server.
- Inspect network request in browser devtools to confirm Authorization header present.
