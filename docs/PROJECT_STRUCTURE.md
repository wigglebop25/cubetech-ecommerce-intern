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
│   │   │   ├── authController.js
│   │   │   └── statsController.js
│   │   ├── services/                    # Business logic layer
│   │   │   ├── productService.js
│   │   │   ├── categoryService.js
│   │   │   ├── orderService.js
│   │   │   ├── customerService.js
│   │   │   ├── authService.js
│   │   │   └── statsService.js
│   │   ├── repositories/                # Data access layer (Prisma queries)
│   │   │   ├── productRepository.js
│   │   │   ├── categoryRepository.js
│   │   │   ├── orderRepository.js
│   │   │   └── adminRepository.js
│   │   ├── middleware/                  # Express middleware
│   │   │   ├── errorHandler.js          # Centralized error handling
│   │   │   └── validateRequest.js       # Request validation
│   │   └── routes/                      # Route definitions with DI
│   │       ├── health.js                # Health check endpoint
│   │       ├── products.js
│   │       ├── categories.js
│   │       ├── orders.js
│   │       ├── customers.js
│   │       ├── auth.js
│   │       └── stats.js
│   ├── __tests__/                       # Test files
│   │   ├── setup.js                     # Test setup (DB cleanup)
│   │   └── routes/                      # Integration tests
│   │       ├── products.test.js
│   │       ├── categories.test.js
│   │       ├── orders.test.js
│   │       ├── auth.test.js
│   │       ├── customers.test.js
│   │       └── stats.test.js
│   ├── jest.config.js                   # Jest configuration
│   ├── package.json
│   └── .env                             # DATABASE_URL, PORT
│
├── client/                              # Frontend (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                  # Navbar, Footer, AdminSidebar, AdminLayout
│   │   │   ├── ui/                      # Button, Modal, Badge, Toast, Spinner, etc.
│   │   │   └── product/                 # ProductCard, ProductGrid, QuantitySelector
│   │   ├── pages/
│   │   │   ├── customer/                # Home, Products, ProductDetail, Cart, Checkout
│   │   │   └── admin/                   # Login, Dashboard, ProductManagement, etc.
│   │   ├── context/
│   │   │   ├── DataContext.jsx          # API-backed state management
│   │   │   ├── CartContext.jsx          # localStorage-backed cart
│   │   │   └── AuthContext.jsx          # API-backed authentication
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
├── bruno/                               # API testing collection
│   └── cubetech-api/
│       ├── bruno.json
│       ├── environments/
│       │   └── local.bru
│       ├── Products/
│       ├── Categories/
│       ├── Orders/
│       ├── Auth/
│       ├── Customers/
│       ├── Stats/
│       └── Health/
│
├── docs/
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
  - `validateRequest.js` — Request validation
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

### bruno/ — API Testing

- Bruno collection for testing API endpoints
- Environment variables for different environments (local, production)
- Version controlled — can be imported by team members

### docs/ — Documentation

- Architecture, data model, API reference
- Project structure, roadmap
- Local-only docs (gitignored): git rules, coding standards, interview guide
