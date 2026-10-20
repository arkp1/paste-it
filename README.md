# Paste it

A small Pastebin-like app for sharing text via unlisted links. A paste can expire after a chosen time or a maximum number of views.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Notes

- Pastes are stored in memory, so they are cleared when the server restarts.
- The in-memory store keeps the example simple and local. Use a database (for example, Postgres or Redis) before deploying it as a durable service.
