# Torre de Control — Product Launch Management Dashboard

Link:

This is my submission for **Reto 2** of the ENGLOBE_CONNECT selection process: a tool for a marketing team to create product launches and move them through a four-stage approval flow, with a list view, a timeline ("Runway") view, and a detail view that all stay in sync.

The idea behind the name: instead of another generic dashboard, I wanted it to feel like an actual control tower — you create a launch, track it through review, and watch it take off.

## The approval flow

A launch moves through four states, and the rules are pretty simple:

- A **creator** writes a launch in **Draft** and, once it's ready, sends it to **In Review**.
- An **approver** looks at it and either **rejects** it (which sends it back to Draft with a required comment explaining why) or **approves** it.
- Once **Approved**, an approver can either **reopen** it (back to Draft, comment required) or **publish** it.
- **Published** is a final state — there's nowhere left to go from there.

Only approvers can approve, reject, reopen, or publish. Only creators can create, edit, and submit for review. Every transition is enforced on the backend, not just hidden in the UI.

## Project structure

Two independent apps, talking to each other over HTTP.

The **backend** is a Node.js and Express API. It has one file that owns the workflow rules (`utils/stateMachine.js`), one that holds the in-memory data (`data/db.js`), and controllers that handle the actual request logic.

The **frontend** is React, built with Vite and styled with Tailwind. `App.jsx` holds the main state and talks to the API, and everything else — the list view, the runway view, the forms — is broken into smaller components underneath it.

## How the data is modeled

Everything lives in memory for this demo, but it's modeled the same way it would be in a real database: a launch has many assets, and a launch has many status-history entries. Swapping the in-memory store for Postgres later shouldn't require rethinking the data — just writing the schema.

## Roles and permissions

There are two roles, and they don't overlap.

A **creator** can create, edit, and delete a launch, but only while it's still in Draft. Once it's sent for review, it's frozen until it comes back to Draft. Submitting for review is also a creator-only action.

An **approver** can't create or edit anything. They approve or reject launches that are In Review, and once a launch is Approved, they can publish it or send it back to Draft.

This isn't just a UI convention — the backend checks every transition against these rules, and each launch comes back from the API with a `permissions` object telling the frontend exactly what the current user can do with it.

## Getting it running

You'll need Node.js 18 or newer.

**Backend first**

```bash
cd backend
npm install
npm start          # http://localhost:4000
```

**Then the frontend, in a separate terminal**

```bash
cd frontend
npm install
npm run dev         # http://localhost:5173
```

Open `http://localhost:5173` in your browser. Vite's dev server proxies anything under `/api/*` straight to the backend on port 4000, so you don't need to set up CORS or hardcode any URLs to get it working locally.

## Main endpoints

`GET /api/launches` lists launches and supports filtering by market, status, a free-text search, and a date range, plus sorting.

`GET /api/launches/:id` returns one launch with its assets and status history included.

`POST /api/launches` creates a launch (creator only). `PUT /api/launches/:id` and `DELETE /api/launches/:id` edit or delete one, but only while it's in Draft.

`POST /api/launches/:id/transition` moves a launch to a new status, with a comment when the transition requires one.

`POST /api/launches/:id/assets` and `DELETE /api/launches/:id/assets/:assetId` add or remove an asset.

Every one of these routes expects two headers: `x-user-role` (`creador` or `aprobador`) and `x-user-name`. It's a simplified stand-in for real authentication — in production this would be JWTs or sessions instead.

## Technologies used

- **Backend:** Node.js, Express, `nanoid` for IDs, `morgan` for request logging, `cors`.
- **Frontend:** React 18, Vite, Tailwind CSS, `lucide-react` for icons.
- **Data:** in-memory `Map` objects for this demo, modeled relationally so a real database is a drop-in replacement rather than a redesign.

## Design decisions

I wanted the app to feel like an operations console rather than a generic admin panel:

- **Palette:** a deep ink background, with amber marking "in review" / primary actions, green for "approved" and "published," and red reserved for rejections and destructive actions.
- **Typography:** Space Grotesk for headings, Inter for body copy, and JetBrains Mono for dates and numeric data.
- **The Runway view** is the piece I'm proudest of: instead of a generic calendar grid, launches are laid out on a vertical timeline grouped by month, styled like an airport landing strip — a colored node per status, and a four-segment bar that lights up as the launch moves through the workflow. It's a small thing, but it ties the visual identity back to the actual concept of a "launch."
- Forms, confirmations, and error messages try to explain *what* happened and *why* in plain language — for example, "You can't edit a launch in 'In Review' status" instead of a generic "not authorized."

## What's missing for production

Being upfront about the current limitations, since this is a demo built against a fixed scope:

- **Authentication isn't real.** Role and username travel as plain HTTP headers, so anyone with something like Postman could spoof `x-user-role` and act as an approver. This needs to become real JWT or session-based auth before it touches actual users.
- **CORS is wide open** (`app.use(cors())` with no origin restriction) — fine for local development, but it should be locked down to a specific origin before deploying anywhere.
- **No pagination** on `GET /api/launches`. It works fine with the handful of seed launches in this demo, but it won't hold up once the list grows.
- **Nothing is persisted.** It's all in-memory `Map`s, so a server restart wipes every launch, asset, and history entry. The data model is already shaped for a real database, but the database itself isn't there yet.
- **Assets are just URLs**, not real file uploads — treated here as a non-core feature that's fine to simulate, per the challenge guidelines.
- **No automated tests.** Everything was checked manually against both roles while building it; that's the first thing I'd add with more time.

