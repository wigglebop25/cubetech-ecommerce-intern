# Development Roadmap

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router v6
- Recharts (admin charts)
- React Icons

**Backend:**
- Express.js
- Prisma ORM
- MySQL database
- Argon2 (password hashing)
- JWT (authentication)
- Nodemailer (email notifications)

---

## Phase 1 — Backend Setup

- [x] Install and configure MySQL
- [x] Initialize Express server with cors and dotenv
- [x] Setup Prisma with MySQL
- [x] Define database schema (products, categories, orders, order_items, admin_users)
- [x] Create seed script with sample data (43 products, 5 categories, 5 orders)
- [x] Build API routes (products, categories, orders, customers, auth, stats)
- [x] Refactor to OOP (Controller-Service-Repository pattern)
- [x] Add dependency injection (DI) to all routes
- [x] Add centralized error handling middleware
- [x] Add health check endpoint
- [x] Add unit tests with Jest and Supertest (71 tests passing)
- [x] Add code comments for interview preparation

## Phase 2 — Frontend Setup

- [x] Scaffold Vite + React project in client/ folder
- [x] Install and configure Tailwind CSS
- [x] Setup React Router with all customer and admin routes
- [x] Build API service layer (services/api.js)
- [x] Build shared UI components (Button, Modal, Badge, Toast, Spinner, EmptyState, SearchBar, ConfirmDialog, Skeleton, Pagination, DatePicker, ScrollToTop)
- [x] Build layout components (Navbar, Footer, AdminSidebar, AdminLayout)
- [x] Build product components (ProductCard, ProductGrid, QuantitySelector)

## Phase 3 — Context & State

- [x] Build DataContext with API integration
- [x] Build CartContext with localStorage persistence
- [x] Build AuthContext with API-backed login
- [x] Build CustomerAuthContext with API-backed login/registration
- [x] Build ThemeContext for dark mode

## Phase 4 — Customer Pages

- [x] Home page (hero banner, categories, featured products)
- [x] Product listing (grid, search, category filter, price sort, pagination)
- [x] Product detail (info, quantity selector, add to cart, related products)
- [x] Shopping cart (quantity controls, remove with confirmation, totals, persistence)
- [x] Checkout (form validation, order creation, payment method selection, discount codes)
- [x] Order confirmation (order number, summary, tax, shipping, discount)
- [x] Customer login and registration
- [x] Customer profile
- [x] Wishlist management
- [x] Customer order history with pagination
- [x] Customer order detail with cancel option

## Phase 5 — Admin Dashboard

- [x] Admin login (API-backed authentication with Argon2)
- [x] Dashboard overview (summary cards, sales chart, low stock alerts)
- [x] Product management (CRUD, search, filter by category/status, image upload)
- [x] Category management (CRUD, deletion guard for assigned products)
- [x] Order management (table, status updates, filter, pagination)
- [x] Order detail view (customer info, items, status update, discount display)
- [x] Customer management (list with order statistics)
- [x] Discount management (CRUD, percentage/fixed types, validation)

## Phase 6 — Integration & Testing

- [x] Connect frontend to backend API
- [x] Admin ↔ Customer data sync via API
- [x] Form validation on all inputs
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Error handling and empty states
- [x] Dark mode support
- [x] Skeleton loading screens
- [x] Mobile-first responsive design

## Phase 7 — Bonus Features

- [x] Product image upload (Pixabay API)
- [x] Discount codes (percentage + fixed)
- [x] Wishlist management
- [x] Customer login and registration
- [x] Order tracking with status history
- [x] Sales charts and analytics
- [x] Low-stock alerts
- [x] Export orders to CSV
- [x] Pagination
- [x] Dark mode
- [x] Role-based admin access
- [x] Email order confirmation (Gmail SMTP)
- [x] Loading indicators and skeleton screens

## Phase 8 — Documentation & Deploy

- [x] Update all documentation
- [x] README with setup instructions
- [x] API reference documentation
- [x] Screenshots (desktop + mobile)
- [x] Deploy backend (Azure VM with Cloudflare tunnel)
- [x] Deploy frontend (Vercel)
- [x] System flow explanation
- [x] Live links (GitHub, Customer Website, Admin Dashboard)
