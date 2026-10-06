# Deploy YouCanBuild on Render

Your logs show **Build successful** then **No open ports detected** and a **second** `npm install; npm run build`. That means the service is a **Web Service** with the wrong **Start Command** — not a **Static Site**.

## Option A — Static Site (recommended, free CDN)

1. **Delete** the current Render service (or leave it and create a new one).
2. **New → Blueprint** → connect `Luluameh/Youcanbuild` → apply [`render.yaml`](../render.yaml).
3. Confirm **Runtime: Static**, **Publish directory: `dist`**, **no Start Command**.
4. Add rewrite **`/*` → `/index.html`** (included in `render.yaml`).

Build command from blueprint:

```bash
npm install --include=dev && npm run build
```

---

## Option B — Keep your existing Web Service

If you stay on a **Web Service**, fix **Settings → Build & Deploy**:

| Field | Value |
|--------|--------|
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |

**Remove** `npm install; npm run build` from **Start Command**. That line runs after deploy, omits devDependencies, and never opens a port — which causes your TypeScript errors.

`npm start` runs `serve` on `dist/` with SPA fallback and binds Render’s `PORT`.

Then **Manual Deploy → Clear build cache & deploy**.

---

## Checklist

- [ ] Node **20.19.4** (from `.node-version`) — your logs already show this ✓
- [ ] Build completes once; deploy does **not** run `tsc` again unless you changed Start Command
- [ ] Open site root, then `/learn/roadmap` (refresh) — should not 404 on static site with rewrite, or on web service with `serve -s`

## Env vars (optional)

All defaults work for Stellar testnet. See `.env.example` or `render.yaml` `envVars`.
