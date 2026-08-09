# Project Structure

```
cubetech-ecommerce/
│
├── server/                              # Backend (Express + Prisma + MySQL)
│   ├── prisma/
│   │   ├── schema.prisma                # Database schema definition
│   │   ├── seed.js                      # Seed data (products, categories, orders, admin)
│   │   └── migrations/                  # Database migrations (auto-generated)
│   ├── src/
│   │   ├── index.js                     # Express server entry point
│   │   ├── db.js                        # Prisma client initialization
│   │   ├── controllers/                 # HTTP request/response handlers
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   ├── customerController.js
│   │   │   ├── customerAuthController.js
│   │   │   ├── customerOrderController.js
│   │   │   ├── discountController.js
│   │   │   ├── authController.js
│   │   │   ├── statsController.js
│   │   │   └── analyticsController.js
│   │   ├── services/                    # Business logic layer
│   │   │   ├── productService.js
│   │   │   ├── categoryService.js
│   │   │   ├── orderService.js
│   │   │   ├── customerService.js
│   │   │   ├── customerAuthService.js
│   │   │   ├── customerOrderService.js
│   │   │   ├── discountService.js
│   │   │   ├── authService.js
│   │   │   ├── statsService.js
│   │   │   ├── analyticsService.js
│   │   │   ├── emailService.js
│   │   │   └── imageService.js
│   │   ├── repositories/                # Data access layer (Prisma queries)
│   │   │   ├── productRepository.js
│   │   │   ├── categoryRepository.js
│   │   │   ├── orderRepository.js
│   │   │   ├── customerRepository.js
│   │   │   ├── customerOrderRepository.js
│   │   │   ├── discountRepository.js
│   │   │   ├── orderStatusRepository.js
│   │   │   └── adminRepository.js
│   │   ├── middleware/                  # Express middleware
│   │   │   ├── errorHandler.js          # Centralized error handling
│   │   │   ├── auth.js                  # Admin JWT authentication
│   │   │   ├── customerAuth.js          # Customer JWT authentication
│   │   │   ├── rateLimiter.js           # Rate limiting
│   │   │   └── sanitize.js              # Input sanitization
│   │   ├── utils/                       # Utility functions
│   │   │   ├── customerJwt.js           # Customer JWT helpers
│   │   │   ├── errorLogger.js           # Error logging
│   │   │   └── orderFilters.js          # Order filter helpers
│   │   └── routes/                      # Route definitions with DI
│   │       ├── health.js                # Health check endpoint
│   │       ├── products.js
│   │       ├── categories.js
│   │       ├── orders.js
│   │       ├── customers.js
│   │       ├── customerOrders.js
│   │       ├── discounts.js
│   │       ├── wishlist.js
│   │       ├── auth.js
│   │       ├── stats.js
│   │       └── analytics.js
│   ├── __tests__/                       # Test files
│   │   ├── setup.js                     # Test setup (DB cleanup)
│   │   └── routes/                      # Integration tests
│   │       ├── products.test.js
│   │       ├── categories.test.js
│   │       ├── orders.test.js
│   │       ├── auth.test.js
│   │       ├── customers.test.js
│   │       ├── customerAuth.test.js
│   │       ├── stats.test.js
│   │       ├── discounts.test.js
│   │       ├── wishlist.test.js
│   │       ├── analytics.test.js
│   │       ├── export.test.js
│   │       └── bulk.test.js
│   ├── uploads/                         # Uploaded files
│   ├── jest.config.js                   # Jest configuration
│   ├── package.json
│   └── .env                             # DATABASE_URL, PORT, JWT_SECRET, etc.
│
├── client/                              # Frontend (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                  # Navbar, Footer, AdminSidebar, AdminLayout
│   │   │   │   ├── CustomerLayout.jsx
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── ui/                      # Button, Modal, Badge, Toast, Spinner, etc.
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── DatePicker.jsx
│   │   │   │   └── ScrollToTop.jsx
│   │   │   └── product/                 # Product-specific components
│   │   │       ├── ProductCard.jsx
│   │   │       ├── ProductGrid.jsx
│   │   │       └── QuantitySelector.jsx
│   │   ├── pages/
│   │   │   ├── customer/                # Customer pages
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── OrderConfirmation.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Wishlist.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── OrderDetail.jsx
│   │   │   └── admin/                   # Admin pages
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ProductManagement.jsx
│   │   │       ├── CategoryManagement.jsx
│   │   │       ├── OrderManagement.jsx
│   │   │       ├── OrderDetail.jsx
│   │   │       ├── CustomerManagement.jsx
│   │   │       └── DiscountManagement.jsx
│   │   ├── context/
│   │   │   ├── DataContext.jsx          # API-backed state management
│   │   │   ├── CartContext.jsx          # localStorage-backed cart
│   │   │   ├── AuthContext.jsx          # API-backed admin authentication
│   │   │   ├── CustomerAuthContext.jsx  # API-backed customer authentication
│   │   │   └── ThemeContext.jsx         # Dark mode toggle
│   │   ├── services/
│   │   │   └── api.js                   # API helper functions (fetch wrapper)
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useDebounce.js
│   │   │   └── useToast.js
│   │   ├── utils/
│   │   │   ├── constants.js             # Status enums, payment methods
│   │   │   ├── helpers.js               # Business logic helpers
│   │   │   ├── validators.js            # Form validation functions
│   │   │   └── formatters.js            # Display formatting (currency, dates)
│   │   ├── App.jsx                      # Route definitions
│   │   └── main.jsx                     # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── screenshots/                         # Desktop and mobile screenshots
│   ├── desktop/
│   │   ├── home-page.png
│   │   ├── product-listing.png
│   │   ├── product-detail.png
│   │   ├── shopping-cart.png
│   │   ├── checkout.png
│   │   ├── admin-dashboard.png
│   │   ├── admin-products.png
│   │   └── admin-orders.png
│   └── mobile/
│       ├── home-page.png
│       ├── product-listing.png
│       ├── product-detail.png
│       ├── shopping-cart.png
│       ├── admin-dashboard.png
│       └── admin-orders.png
│
├── docs/                                # Documentation
│   ├── ARCHITECTURE.md                  # System architecture and data flow
│   ├── PROJECT_STRUCTURE.md             # File organization (this file)
│   ├── DATA_MODEL.md                    # Database schema documentation
│   ├── API_REFERENCE.md                 # API endpoints with curl examples
│   └── ROADMAP.md                       # Development roadmap
│
├── .gitignore
└── README.md
```

## Where Things Go

### server/ — Backend

- `prisma/` — Database schema, migrations, seed data
  - `schema.prisma` — Defines tables, relations, and enums
  - `seed.js` — Populates database with sample data
  - `migrations/` — Auto-generated SQL migrations
- `src/controllers/` — HTTP request/response handlers
  - Each controller handles one resource's HTTP operations
  - Receives service via dependency injection
  - Delegates business logic to service layer
- `src/services/` — Business logic layer
  - Contains validation, business rules, and orchestration
  - Receives repository via dependency injection
  - Throws errors with status codes for controller to catch
- `src/repositories/` — Data access layer
  - Handles all Prisma database operations
  - Abstracts queries from business logic
  - Each repository handles one database table
- `src/middleware/` — Express middleware
  - `errorHandler.js` — Centralized error handling
  - `auth.js` — Admin JWT authentication
  - `customerAuth.js` — Customer JWT authentication
  - `rateLimiter.js` — Rate limiting (100 req/15min API, 5 req/15min auth)
  - `sanitize.js` — Input sanitization (XSS prevention)
- `src/routes/` — Route definitions with dependency injection
  - Imports repository, service, and controller
  - Creates instances with DI (repository → service → controller)
  - Maps HTTP methods to controller methods
- `src/db.js` — Prisma client initialization
- `src/index.js` — Express server setup, middleware, route mounting

### client/ — Frontend

- `components/` — Reusable UI pieces
  - `layout/` — Page-level wrappers (Navbar, Footer, Admin sidebar)
  - `ui/` — Generic primitives (Button, Modal, Badge) with no business logic
  - `product/` — Product-specific components (ProductCard, QuantitySelector)
- `pages/` — Full page views
  - `customer/` — Pages customers see (Home, Products, Cart, Checkout)
  - `admin/` — Pages admin sees (Dashboard, CRUD management pages)
- `context/` — Shared state
  - `DataContext` — API-backed CRUD for products, categories, orders, customers
  - `CartContext` — localStorage-backed shopping cart
  - `AuthContext` — API-backed admin authentication
  - `CustomerAuthContext` — API-backed customer authentication
  - `ThemeContext` — Dark mode toggle
- `services/` — API helper functions
  - `api.js` — Fetch wrapper for all backend API calls
- `hooks/` — Reusable logic extracted from components
  - `useLocalStorage` — Read/write to localStorage with React state sync
  - `useDebounce` — Debounce a value (used for search inputs)
  - `useToast` — Trigger toast notifications
- `utils/` — Pure utility functions
  - `constants` — Enums and config values
  - `helpers` — Business logic helpers
  - `validators` — Form validation functions
  - `formatters` — Display formatting functions

### screenshots/ — Documentation

- Desktop and mobile screenshots for README
- Used to showcase the application in the assessment

### docs/ — Documentation

- Architecture, data model, API reference
- Project structure, roadmap
- Local-only docs (not tracked): git rules, coding standards, interview guide
