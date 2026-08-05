# Development Roadmap

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router v6
- Recharts (admin charts)

**Backend:**
- Express.js
- Prisma ORM
- MySQL database
- Argon2 (password hashing)

---

## Phase 1 — Backend Setup

- [x] Install and configure MySQL
- [x] Initialize Express server with cors and dotenv
- [x] Setup Prisma with MySQL
- [x] Define database schema (products, categories, orders, order_items, admin_users)
- [x] Create seed script with sample data (12 products, 5 categories, 5 orders)
- [x] Build API routes (products, categories, orders, customers, auth, stats)
- [x] Refactor to OOP (Controller-Service-Repository pattern)
- [x] Add dependency injection (DI) to all routes
- [x] Add centralized error handling middleware
- [x] Add health check endpoint
- [x] Add unit tests with Jest and Supertest (29 tests passing)
- [x] Add Bruno API collection for testing
- [x] Add code comments for interview preparation

## Phase 2 — Frontend Setup

- [ ] Scaffold Vite + React project in client/ folder
- [ ] Install and configure Tailwind CSS
- [ ] Setup React Router with all customer and admin routes
- [ ] Build API service layer (services/api.js)
- [ ] Build shared UI components (Button, Modal, Badge, Toast, Spinner, EmptyState, SearchBar, ConfirmDialog)
- [ ] Build layout components (Navbar, Footer, AdminSidebar, AdminLayout)
- [ ] Build product components (ProductCard, ProductGrid, QuantitySelector)

## Phase 3 — Context & State

- [ ] Build DataContext with API integration
- [ ] Build CartContext with localStorage persistence
- [ ] Build AuthContext with API-backed login

## Phase 4 — Customer Pages

- [ ] Home page (hero banner, categories, featured products)
- [ ] Product listing (grid, search, category filter, price sort)
- [ ] Product detail (info, quantity selector, add to cart, related products)
- [ ] Shopping cart (quantity controls, remove, totals, persistence)
- [ ] Checkout (form validation, order creation, payment method selection)
- [ ] Order confirmation (order number, summary)

## Phase 5 — Admin Dashboard

- [ ] Admin login (API-backed authentication with Argon2)
- [ ] Dashboard overview (summary cards, sales chart)
- [ ] Product management (CRUD, search, filter by category/status)
- [ ] Category management (CRUD, deletion guard for assigned products)
- [ ] Order management (table, status updates, filter)
- [ ] Order detail view (customer info, items, status update)
- [ ] Customer management (list with order statistics)

## Phase 6 — Integration & Testing

- [ ] Connect frontend to backend API
- [ ] Admin ↔ Customer data sync via API
- [ ] Form validation on all inputs
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Error handling and empty states

## Phase 7 — Documentation & Deploy

- [ ] Update all documentation
- [ ] README with setup instructions
- [ ] API reference documentation
- [ ] Screenshots (desktop + mobile)
- [ ] Deploy backend (Railway/Render/Fly.io)
- [ ] Deploy frontend (Vercel/Netlify)
