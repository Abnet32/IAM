# InfNova — Internship Applicant Management

A production-ready applicant tracking dashboard for managing internship recruitment. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

---

## Features

- **Authentication** — Email/password login with JWT token management
- **Dashboard** — Real-time stats, application trends, hiring pipeline, and top universities
- **Applicants** — Paginated table with search, filtering, sorting, and status management
- **Applicant Detail** — Full profile view with skills, links, notes, and status timeline
- **Settings** — Profile editing and theme customization
- **Theme Support** — Light, dark, and system mode via next-themes
- **Responsive Design** — Collapsible sidebar, mobile-friendly layouts
- **Loading & Error States** — Skeleton loaders and graceful error handling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (base-nova style) |
| Data Fetching | TanStack React Query 5 |
| HTTP Client | Axios |
| State Management | Zustand 5 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Theming | next-themes |

---

## Folder Structure

```
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (font, ThemeProvider)
│   ├── login/page.tsx            # Login page
│   ├── not-found.tsx             # 404 page
│   └── (dashboard)/              # Dashboard route group
│       ├── layout.tsx            # Sidebar + header layout wrapper
│       ├── page.tsx              # Dashboard home
│       ├── applicants/           # Applicant list & detail pages
│       ├── settings/             # Settings page
│       └── _components/          # Dashboard-specific components
├── components/                   # Shared components
│   ├── app-sidebar.tsx           # Main navigation sidebar
│   ├── site-header.tsx           # Top header with breadcrumbs
│   ├── theme-provider.tsx        # Theme context provider
│   ├── theme-toggle.tsx          # Dark/light toggle button
│   └── ui/                       # shadcn/ui primitives
├── hooks/                        # Custom React hooks
│   ├── use-hydrate-auth.ts       # Hydrate auth from localStorage
│   └── use-mobile.ts             # Mobile breakpoint detection
├── lib/                          # Utilities
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── src/                          # Application source
│   ├── hooks/                    # React Query hooks
│   │   └── use-api.ts            # Data fetching hooks
│   ├── lib/                      # Core libraries
│   │   └── axios.ts              # Axios instance with interceptors
│   ├── providers/                # Context providers
│   │   └── providers.tsx         # QueryClient provider
│   ├── services/                 # API service functions
│   │   └── api.ts                # All API calls
│   ├── store/                    # Zustand stores
│   │   └── index.ts              # Auth + filter stores
│   └── types/                    # TypeScript types
│       └── api.ts                # API type definitions
└── public/                       # Static assets
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Abnet32/IAM.git
cd IAM

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://infnova-intern.vercel.app/api
```

| Variable | Description | Required |
|----------|------------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend API | Yes |

---

## Available Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Architecture

### Feature-Based Organization

The project follows a hybrid architecture combining App Router conventions with feature-based organization:

- **Route groups** — `(dashboard)` wraps all authenticated pages with sidebar + header layout
- **Component colocation** — Dashboard-specific components live in `_components/` next to the dashboard pages
- **Shared components** — Reusable UI lives in `components/`

### State Management

- **Zustand** for client-side state (auth tokens, user data, filter preferences)
- **TanStack Query** for server state (API data caching, mutations, invalidation)
- **React state** for local UI state (form inputs, modals, toggles)

### API Layer

```
Axios Instance (interceptors) → Service Functions → React Query Hooks → Components
```

- **Axios** handles HTTP, auth headers (Bearer token), and 401 redirect
- **Services** are pure async functions that call API endpoints
- **Hooks** wrap services with React Query for caching, loading states, and invalidation

---

## Authentication Flow

1. User submits credentials on `/login`
2. `login()` service calls `POST /auth/login`
3. Token + user data stored in Zustand + localStorage
4. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
5. On 401 response, token is cleared and user is redirected to `/login`
6. `useHydrateAuth` hook restores auth state from localStorage on page load

---

## API Integration

All API calls go through a centralized Axios instance:

- **Base URL** — Configured via `NEXT_PUBLIC_API_BASE_URL`
- **Auth** — Bearer token injected via request interceptor
- **Error Handling** — 401 responses trigger automatic logout
- **Query Invalidation** — Mutations invalidate relevant query caches for fresh data

---

## Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | Full-width content, collapsed sidebar (sheet) |
| Tablet (768px - 1024px) | Two-column grids, sidebar toggles |
| Desktop (> 1024px) | Full sidebar, multi-column layouts |

---

## Performance Optimizations

- **React Query caching** — Reduces redundant API calls with configurable stale times
- **Memoization** — `useMemo` for expensive computations (trend data, university stats)
- **Lazy rendering** — Dashboard components only render when data is available
- **CSS transitions** — Lightweight animations without JavaScript overhead
- **Image optimization** — Next.js built-in image optimization for static assets

---

## Future Improvements

- Real-time notifications via WebSocket
- Export applicants to CSV/PDF
- Role-based access control (admin, reviewer, viewer)
- Bulk status updates
- Advanced analytics with date range filtering
- Unit and integration tests
- CI/CD pipeline with GitHub Actions

---

## Author

**Abnet** — [GitHub](https://github.com/Abnet32)
