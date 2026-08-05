# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React)                          │
│                                                              │
│  Customer Pages ←→ DataContext ←→ API Service ←→ Express    │
│  Admin Pages    ←→ DataContext ←→ API Service ←→ Express    │
│  Cart           ←→ CartContext ←→ localStorage (per-user)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server (Express)                          │
│                                                              │
│  Routes ←→ Controllers ←→ Services ←→ Repositories ←→ DB  │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite + Tailwind CSS | UI framework |
| Routing | React Router v6 | Client-side routing |
| State | React Context | Shared state management |
| HTTP | Fetch API | API communication |
| Backend | Express.js | REST API server |
| ORM | Prisma | Database queries and migrations |
| Database | MySQL | Data persistence |
| Auth | Argon2 | Password hashing |

## OOP Architecture: Controller-Service-Repository Pattern

The backend follows a 3-layer architecture:

### Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Repository** | Database operations only | `prisma.product.findMany()` |
| **Service** | Business logic, validation | Check price > 0, verify exists |
| **Controller** | HTTP req/res handling | Parse params, send response |
| **Route** | URL mapping only | `router.get('/', controller.getAll)` |
| **Middleware** | Cross-cutting concerns | Error handling, validation |

### Data Flow Example: Get All Products

```
1. GET /api/products
   ↓
2. Route: router.get('/', controller.getAll)
   ↓
3. Controller: parse query params, call service
   ↓
4. Service: business logic (if any)
   ↓
5. Repository: prisma.product.findMany()
   ↓
6. Database: MySQL query
   ↓
7. Response: JSON array of products
```

### Dependency Injection (DI)

Each layer receives its dependencies via constructor:

```javascript
// Repository → Service → Controller → Route
const productRepository = require('../repositories/productRepository');
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);
```

**Benefits:**
- Testability (mock repository in tests)
- Flexibility (swap implementations)
- Separation of concerns

## Data Flow

### Customer Flow

1. Customer visits site → React loads
2. DataContext calls `GET /api/products` → Express receives request
3. Route → Controller → Service → Repository → Prisma → MySQL
4. Data returns to client → displayed in UI

### Admin Flow

1. Admin logs in → `POST /api/auth/login` with Argon2 verification
2. Admin adds product → `POST /api/products` → Service validates → Repository creates
3. Customer refreshes → sees new product (same API call)

### Cart Flow

- Cart uses localStorage (per-user, no backend needed)
- CartContext manages add/remove/update operations
- Persists across page refreshes

## Context Structure

### DataContext (API-backed)

Exposes:
- `products`, `categories`, `orders`, `customers`, `stats`
- `fetchProducts()`, `addProduct()`, `updateProduct()`, `deleteProduct()`
- `fetchCategories()`, `addCategory()`, `updateCategory()`, `deleteCategory()`
- `fetchOrders()`, `addOrder()`, `updateOrderStatus()`
- `fetchStats()`

### CartContext (localStorage)

Exposes:
- `cartItems`, `cartTotal`, `cartCount`
- `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`

### AuthContext (API-backed)

Exposes:
- `isAuthenticated`, `login()`, `logout()`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/categories` | List categories with product counts |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category (blocks if products exist) |
| GET | `/api/orders` | List orders (with filters) |
| GET | `/api/orders/:id` | Get single order with items |
| POST | `/api/orders` | Create order (updates product stock) |
| PUT | `/api/orders/:id/status` | Update order status |
| GET | `/api/customers` | List customers (derived from orders) |
| POST | `/api/auth/login` | Admin login (Argon2 verification) |
| GET | `/api/stats` | Get dashboard statistics |

## Routing

### Customer Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/products` | Product Listing |
| `/product/:id` | Product Detail |
| `/cart` | Shopping Cart |
| `/checkout` | Checkout |
| `/order/:id` | Order Confirmation |

### Admin Routes

| Path | Page |
|------|------|
| `/admin/login` | Login |
| `/admin/dashboard` | Dashboard |
| `/admin/products` | Product Management |
| `/admin/categories` | Category Management |
| `/admin/orders` | Order Management |
| `/admin/orders/:id` | Order Detail |
| `/admin/customers` | Customer Management |

## Order Status Flow

```
Pending → Confirmed → Preparing → Shipped → Completed
                                            ↘ Cancelled
```

## Admin ↔ Customer Sync

| Admin Action | Customer Effect |
|--------------|-----------------|
| Add product | Product appears in listing |
| Set product to Inactive | Product hidden from listing |
| Update product price | Price reflects on product page |
| Delete product | Product removed from listing |

| Customer Action | Admin Effect |
|-----------------|--------------|
| Place order | Order appears in admin order list with "Pending" status |
| Order placed | Product stock decremented |

## Database

MySQL database with the following tables:

- **Category** — Product categories
- **Product** — Products with category relation
- **Order** — Customer orders
- **OrderItem** — Individual items in an order
- **AdminUser** — Admin credentials (Argon2 hashed passwords)

See `DATA_MODEL.md` for detailed schema.
