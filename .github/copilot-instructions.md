## Cohort Tools — Copilot Instructions

Quick context
- Monorepo with two main apps: `client/` (React + Vite + Tailwind) and `server/` (Express + Mongoose).
- Dev ports: client runs on `5173` (Vite), server listens on `5005`.
- API base (dev): `http://localhost:5005/api` (docs available at `/docs`).

How this code is organized (big picture)
- server/
  - `app.js`: primary Express app — most cohort & student endpoints live inline here.
  - `routes/`: auth and user routes are modularized (`auth.routes.js`, `user.routes.js`).
  - `models/`: Mongoose models (`Cohort.model.js`, `Student.model.js`, `User.model.js`).
  - `middleware/isAuthenticated.js`: JWT middleware used by routes (expects `Authorization: Bearer <token>`).
  - `cohorts.json`, `students.json`: sample data files; the runtime uses MongoDB via Mongoose.

- client/
  - `src/pages/` and `src/components/`: React pages and UI components (CRUD UI for cohorts & students).
  - `src/context/auth.context.jsx`: auth flow — stores token in `localStorage` and verifies with `/auth/verify`.
  - `src/utils/index.js`: helper utilities (slug/date formatting).
  - `vite` env: uses `VITE_API_URL` (client reads `import.meta.env.VITE_API_URL`).

Run / debug (developer workflows)
- Start server (dev):
  - cd server && npm install
  - cd server && npm run dev  # uses nodemon; server listens on 5005
- Start client (dev):
  - cd client && npm install
  - cd client && npm run dev  # vite dev server on 5173
- Environment notes:
  - Server expects `JWT_SECRET` in environment (uses `dotenv`).
  - Client expects `VITE_API_URL` when running with Vite for API calls.
  - DB: app connects to `mongodb://127.0.0.1:27017/cohort-tools-api` by default — run a local MongoDB for full functionality.

Auth and integration patterns
- JWT flow: `POST /auth/login` returns `{ authToken }`; client stores it in `localStorage` under `authToken`.
- Protected endpoints use `Authorization: Bearer <token>`; middleware is in `server/middleware/isAuthenticated.js` (express-jwt).
- Note: some files reference `jwt.middleware` by path but the actual file present is `isAuthenticated.js`. Be cautious when editing or adding middleware imports.

Project-specific conventions & gotchas
- Server mixes inline route definitions (cohorts/students in `app.js`) with modular routes (`routes/`). When adding endpoints, follow the existing pattern for that resource.
- Client state & auth: `AuthContext` centralizes token storage, verification and logout flows — prefer using it for auth-related changes.
- Use `axios` in the client for API calls; headers must include the Bearer token when calling protected routes.
- CORS: server allows origin `http://localhost:5173` in dev; update when changing client host/port.

Pointers for automated edits by agents
- Read and prefer `server/middleware/isAuthenticated.js` when working with auth. Verify imports in `routes/` and `app.js` for inconsistent filenames.
- When changing routes, update both `app.js` and `client` calls if the endpoint paths change.
- Keep port and env assumptions in mind: if you change `PORT` or DB URL, update `client/.env` (Vite) and mention to maintainers.

Files worth opening first
- [server/app.js](server/app.js)
- [server/routes/auth.routes.js](server/routes/auth.routes.js)
- [server/middleware/isAuthenticated.js](server/middleware/isAuthenticated.js)
- [server/models/User.model.js](server/models/User.model.js)
- [client/src/context/auth.context.jsx](client/src/context/auth.context.jsx)
- [client/package.json](client/package.json) and [server/package.json](server/package.json)

If you need clarification or want the doc expanded with examples (e.g., sample axios calls, tests, or how to seed the DB), tell me which area to expand.
