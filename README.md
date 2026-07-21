# InfNova Internship Applicant Management (IAM)

A modern, full-featured applicant tracking dashboard built for managing internship applications. Admins can view, search, filter, and manage applicants through a responsive, dark-mode-enabled interface.

## Setup Instructions

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/Abnet32/IAM.git
cd IAM

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

### Login Credentials

Use the provided API credentials to authenticate:

- **Email:** `admin@infnova.tech`
- **Password:** `InternChallenge2026!`

## Technologies Used

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 16 (App Router) | File-based routing, layouts, server components |
| **Language** | TypeScript 5 | Type safety across the entire codebase |
| **UI Library** | React 19 | Component rendering and state management |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with CSS-first config |
| **UI Primitives** | shadcn/ui (base-nova style) + @base-ui/react | Accessible, composable component primitives |
| **Server State** | TanStack React Query v5 | Data fetching, caching, mutations, cache invalidation |
| **Client State** | Zustand v5 | Authentication state, filter preferences |
| **HTTP Client** | Axios | API requests with interceptors for auth and error handling |
| **Charts** | Recharts v3 | Dashboard visualizations (area charts, bar charts) |
| **Theming** | next-themes | Dark/light mode with system preference detection |
| **Toasts** | Sonner v2 | Colorized, accessible toast notifications |
| **Icons** | Lucide React | Consistent icon library throughout the app |

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Pages   │  │Components│  │   Zustand     │  │
│  │ (routes) │──│ (UI)     │──│   Stores      │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│       │              │              │            │
│       └──────────────┴──────────────┘            │
│                      │                           │
│              ┌───────┴────────┐                  │
│              │  React Query   │                  │
│              │    Hooks       │                  │
│              └───────┬────────┘                  │
│                      │                           │
│              ┌───────┴────────┐                  │
│              │  Service Layer │                  │
│              │  (api.ts)      │                  │
│              └───────┬────────┘                  │
│                      │                           │
│              ┌───────┴────────┐                  │
│              │   Axios +      │                  │
│              │  Interceptors  │                  │
│              └───────┬────────┘                  │
│                      │                           │
└──────────────────────┼───────────────────────────┘
                       │  HTTPS
                       ▼
          ┌────────────────────────┐
          │   Backend API          │
          │   (Vercel-hosted)      │
          │   /api/*               │
          └────────────────────────┘
```

### Routing & Layouts

The app uses Next.js App Router with a route group pattern:

```
app/
├── layout.tsx                    # Root: font, ThemeProvider, Toaster
├── login/page.tsx                # Login (outside dashboard layout)
├── not-found.tsx                 # Custom 404
└── (dashboard)/                  # Authenticated route group
    ├── layout.tsx                # Sidebar + header + React Query provider
    ├── page.tsx                  # Dashboard home
    ├── applicants/
    │   ├── page.tsx              # Applicant list with filters/pagination
    │   └── [id]/page.tsx         # Applicant detail profile
    └── settings/page.tsx         # Profile + appearance settings
```

The login page lives outside the `(dashboard)` group, so it renders without the sidebar/header chrome. All dashboard pages share the sidebar + header layout.

### State Management (Three Layers)

| Layer | Tool | Manages |
|-------|------|---------|
| **Server state** | React Query | API data, loading/error states, mutations, cache invalidation |
| **Client state** | Zustand | Auth (token + user), filter/sort/pagination preferences |
| **Local UI state** | useState | Form inputs, toggles, edited notes |

React Query is configured with a 15-second stale time, single retry on failure, and no refetch on window focus. The dashboard auto-refreshes every 30 seconds.

### Auth Flow

```
Login form → POST /auth/login → Store JWT in localStorage
                                    ↓
              Axios interceptor attaches Bearer token to all requests
                                    ↓
              Any 401 response → Clear token → Redirect to /login
```

There is no Next.js middleware for route protection. Auth is entirely client-side: the JWT is stored in localStorage, attached to requests via an Axios request interceptor, and 401 responses trigger automatic logout with a toast notification.

### API Layer

All API communication flows through four layers:

1. **Axios instance** (`src/lib/axios.ts`) — Configured with the base URL, request interceptor for auth, response interceptor for 401 handling
2. **Service functions** (`src/services/api.ts`) — Typed wrappers around Axios calls (login, getApplicants, updateStatus, etc.)
3. **React Query hooks** (`src/hooks/use-api.ts`) — `useQuery` for reads, `useMutation` for writes with automatic cache invalidation and toast feedback
4. **Components** — Consume hooks, render data, trigger mutations

### Component Structure

- **`components/ui/`** — 24 shadcn/ui primitives (buttons, inputs, tables, dropdowns, etc.)
- **`components/`** — Shared layout components (sidebar, header, theme toggle)
- **`app/(dashboard)/_components/`** — Dashboard-specific components (stats cards, charts, pipeline)

## Assumptions

1. **Mock backend API** — The API at `https://infnova-intern.vercel.app/api` is a session-based mock. Status/notes changes persist within a login session but reset on re-login since each new login creates a fresh token.

2. **Client-side auth** — No server-side rendering for auth. Protected routes rely on 401 API responses rather than middleware. An unauthenticated user can technically load dashboard pages but will be redirected when the first API call fails.

3. **Single admin role** — The app assumes a single admin user type. No role-based access control or multi-user scenarios are implemented.

4. **Synthetic dashboard data** — Some dashboard visualizations (application trends, university rankings) are generated from real summary counts using a seeded PRNG, not from actual per-record data.

5. **localStorage for auth** — JWT is stored in localStorage rather than httpOnly cookies. This is simpler but less secure for production use.

6. **No offline support** — The app requires an active network connection. There is no service worker or offline caching.

## What I Would Improve With More Time

1. **Route protection** — Add Next.js middleware to redirect unauthenticated users at the server level, preventing any dashboard page from rendering without a valid token.

2. **Persistent data** — If the backend supported it, implement optimistic updates (updating the UI immediately before the server confirms) for status changes and notes.

3. **Accessibility** — Add comprehensive ARIA labels, keyboard navigation for the data table, focus management for modals, and screen reader announcements for toast notifications.

4. **Testing** — Add unit tests for service functions and hooks, component tests with React Testing Library, and E2E tests with Playwright for critical user flows (login, status change, pagination).

5. **Error boundaries** — Implement React error boundaries to gracefully handle unexpected render errors, especially in the dashboard charts and data-heavy components.

6. **API layer improvements** — Add request deduplication, a global loading indicator for navigation, and retry logic with exponential backoff for transient failures.

7. **Performance** — Implement virtual scrolling for large applicant lists, code-split the dashboard charts, and add image optimization for any user-uploaded content.

8. **Multi-user support** — Add role-based permissions, audit logging for status changes, and the ability for multiple admins to collaborate without session conflicts.

9. **URL-based filter state** — Sync filter/sort/pagination state with URL query parameters so users can share filtered views and use browser back/forward navigation.

10. **E2E error simulation** — The API supports `simulateError` and `delay` query parameters. Build a developer panel to test loading states, error states, and slow network conditions.
