# Buddy Script

A social feed application built for the Appifylab Full Stack Engineer selection task. Converted three provided HTML/CSS design files (Login, Register, Feed) into a full-stack Next.js application.

---

## Tech Stack

- **Framework** — Next.js 16.2.9 (App Router)
- **Frontend** — React 19.2.4, TypeScript, Bootstrap 5, Custom CSS from design
- **Backend** — Next.js Route Handlers (API routes)
- **Database** — MongoDB with Mongoose
- **Auth** — JWT stored in HTTP-only cookies
- **Fonts** — Poppins via `next/font/google`, FontAwesome and Flaticon via `next/font/local`
- **Notifications** — react-hot-toast

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Fill in `.env.local` at the root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```text
app/
  api/auth/         → login, register, logout route handlers
  feed/             → protected feed page
  login/            → login page
  register/         → register page
components/
  auth/             → AuthLayout, AuthHero, LoginForm, RegisterForm, etc.
  feed/             → FeedNavbar, LeftSidebar, RightSidebar
lib/
  assets/           → images.ts, fonts.ts
  auth/             → jwt.ts (sign/verify tokens)
  db/               → mongoose.ts (cached connection)
  models/           → User.ts
  styles/           → vendor CSS files (bootstrap, common, main, responsive)
public/
  images/           → all 103 design images
  fonts/            → FontAwesome + Flaticon woff2 files
```

---

## What's Been Done

### Authentication

- Registration form with first name, last name, email, password fields
- Login form with email and password
- Passwords hashed with bcrypt (cost factor 12)
- JWT signed on login/register, stored as HTTP-only cookie (7 day expiry)
- Logout clears the cookie by setting maxAge to 0
- Vague error message on login ("Invalid email or password") to prevent user enumeration
- Toast notifications for success, error, and warning states using react-hot-toast
- Client-side validation before hitting the API (empty fields, password length, terms checkbox)
- Server-side validation in route handlers as well

### Feed Page

- Basic feed page structure built from the provided design
- Three column layout — left sidebar (explore nav, suggested people, events), center (placeholder for posts), right sidebar (you might like, friends list)
- Navbar with logo, search bar, home/friends/notifications/messages icons, profile section
- Static data used for sidebar content for now
- Auth guard temporarily bypassed so the page is accessible for debugging (root redirects to `/feed`)

### Design Conversion

- All three HTML pages (login, register, feed) converted to Next.js components
- All `<img src=` tags replaced with Next.js `<Image>` component
- All fonts self-hosted using `next/font` — no external font requests at runtime
- Original CSS files kept as-is (bootstrap, common, main, responsive) imported in `app/layout.tsx`
- Design assets (images + fonts) copied to `public/` folder and mapped in `lib/assets/images.ts`

---

## Mistakes & Fixes

- **Unclosed CSS comment** — The original `common.css` design file had an unclosed `/* */` comment at line 2144. PostCSS was throwing a build error. Fixed by adding the closing `*/`.

- **MongoDB URI throwing at module level** — Initially the `connectDB()` function had the `MONGODB_URI` validation at the top of the module. During `next build`, Next.js evaluates all modules and it threw an error even with empty `.env.local`. Moved the check inside the function body so it only throws at runtime when actually called.

- **Wrong import path after renaming `src` to `lib`** — After renaming the source directory, some components still had `@/src/assets/images` import paths. This caused module not found errors in the dev server. Fixed by updating all imports to `@/lib/assets/images`.

- **Nested `<a>` inside `<Link>`** — In `LeftSidebar.tsx`, the event cards were wrapped in a `<Link>` and had another `<Link>` ("Going" button) inside them. HTML doesn't allow `<a>` nested inside `<a>`, React throws a hydration error. Fixed by changing the inner link to a `<span>`.

- **`_layout_main_wrapper` confusion** — This class appears on the outermost wrapper in all three design HTML files. Spent time looking for its CSS definition but it doesn't have one. It's a JavaScript hook used in `custom.js` for the dark mode toggle (`document.querySelector("._layout_main_wrapper")`). Not a styling class, just a selector target.

---

## What's Remaining

- Feed middle column — post creator, post cards, likes, comments, replies
- Private vs public post toggle
- Proper auth guard on `/feed` (currently bypassed for debugging)
- Google OAuth (client ID/secret left empty in env for now)
- Forgot password (not required per task spec)
- Database indexes for scale (posts sorted by createdAt, user lookups by email)
- Video walkthrough
- Deployment
