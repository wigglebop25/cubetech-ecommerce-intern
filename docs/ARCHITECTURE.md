# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React)                          │
│                                                              │
│  Customer Pages ←→ DataContext ←→ API Service ←→ Express    │
│  Admin Pages    ←→ DataContext ←→ API Service ←→ Express    │
│  Cart           ←→ CartContext ←→ localStorage (per-user)   │
│  Auth           ←→ AuthContext ←→ API Service ←→ Express    │
│  Customer Auth  ←→ CustomerAuthContext ←→ API Service       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server (Express)                          │
│                                                              │
│  Routes ←→ Controllers ←→ Services ←→ Repositories ←→ DB  │
│  Middleware: Auth, Rate Limiting, Sanitization, Error Handler│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (MySQL)                          │
│                                                              │
│  Product, Category, Order, OrderItem, Customer, Discount,   │
│  Wishlist, AdminUser, OrderStatusHistory                     │
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
| Auth | Argon2 + JWT | Password hashing and tokens |
| Email | Nodemailer (Gmail SMTP) | Email notifications |
| Images | Pixabay API | Product image search |

## OOP Architecture: Controller-Service-Repository Pattern

The backend follows a 3-layer architecture:

### Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Repository** | Database operations only | `prisma.product.findMany()` |
| **Service** | Business logic, validation | Check price > 0, verify exists |
| **Controller** | HTTP req/res handling | Parse params, send response |
| **Route** | URL mapping only | `router.get('/', controller.getAll)` |
| **Middleware** | Cross-cutting concerns | Error handling, validation, auth |

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

## Authentication

### Admin Authentication

- Uses `JWT_SECRET` environment variable
- Token includes `role: 'admin'`
- Middleware: `authenticate` + `authorize(['admin'])`
- Passwords hashed with Argon2

### Customer Authentication

- Uses `CUSTOMER_JWT_SECRET` environment variable
- Token includes `role: 'customer'`
- Middleware: `customerAuth`
- Passwords hashed with Argon2
- Separate from admin auth (security isolation)

### Security Features

- Rate limiting (100 req/15min API, 5 req/15min auth)
- Input sanitization (XSS prevention)
- CORS configuration
- Helmet security headers

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

### Checkout Flow

1. Customer fills out checkout form
2. Validates form fields (name, email, phone, address)
3. Applies discount code (optional)
4. Calculates tax (12% VAT) and shipping
5. Creates order via `POST /api/orders`
6. Backend generates order number
7. Sends confirmation email via Gmail SMTP
8. Clears cart and redirects to order confirmation

### Order Status Flow

```
Pending → Confirmed → Preparing → Shipped → Completed
                                            ↘ Cancelled
```

- Stock decrements when status changes to "Confirmed"
- Stock restores when order is cancelled (from Confirmed/Preparing/Shipped)
- Forward-only status flow (no going back)

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

### CustomerAuthContext (API-backed)

Exposes:
- `isAuthenticated`, `customer`, `login()`, `register()`, `logout()`, `getProfile()`

### ThemeContext (localStorage)

Exposes:
- `darkMode`, `toggleDarkMode()`

## Discount System

### Types

- **Percentage** — Apply percentage off subtotal (e.g., 10%)
- **Fixed** — Apply fixed amount off (e.g., ₱200)

### Validation Rules

- Minimum order amount
- Maximum usage count
- Expiration date
- Active/inactive status

### Calculation

```
Discount Amount = (subtotal * value / 100) for percentage
Discount Amount = value for fixed
Tax = (subtotal - discountAmount) * 0.12
Total = (subtotal - discountAmount) + tax + shipping
```

## Email Notifications

- Uses Nodemailer with Gmail SMTP
- Sends emails for:
  - Order confirmation
  - Order status updates
  - Order cancellation
  - Customer welcome

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | None |
| GET | `/api/products` | List all products | None |
| GET | `/api/products/:id` | Get single product | None |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/categories` | List categories | None |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |
| GET | `/api/orders` | List orders | Admin |
| GET | `/api/orders/:id` | Get single order | Admin |
| POST | `/api/orders` | Create order | Customer |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| GET | `/api/customers` | List customers | Admin |
| POST | `/api/customers/register` | Register customer | None |
| POST | `/api/customers/login` | Login customer | None |
| GET | `/api/customers/profile` | Get profile | Customer |
| PUT | `/api/customers/profile` | Update profile | Customer |
| GET | `/api/customer/orders` | Get customer orders | Customer |
| GET | `/api/customer/orders/:id` | Get customer order | Customer |
| PUT | `/api/customer/orders/:id/cancel` | Cancel order | Customer |
| GET | `/api/wishlist` | Get wishlist | Customer |
| POST | `/api/wishlist` | Add to wishlist | Customer |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist | Customer |
| DELETE | `/api/wishlist` | Clear wishlist | Customer |
| GET | `/api/discounts` | List discounts | Admin |
| POST | `/api/discounts` | Create discount | Admin |
| PUT | `/api/discounts/:id` | Update discount | Admin |
| DELETE | `/api/discounts/:id` | Delete discount | Admin |
| POST | `/api/discounts/validate` | Validate discount | None |
| POST | `/api/auth/login` | Admin login | None |
| GET | `/api/stats` | Dashboard stats | Admin |
| GET | `/api/analytics/dashboard` | Dashboard analytics | Admin |
| GET | `/api/analytics/sales` | Sales by period | Admin |
| GET | `/api/analytics/top-products` | Top products | Admin |
| GET | `/api/analytics/revenue` | Revenue by category | Admin |
| GET | `/api/orders/export` | Export orders | Admin |

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
| `/login` | Customer Login |
| `/register` | Customer Register |
| `/profile` | Customer Profile |
| `/wishlist` | Wishlist |
| `/orders` | Customer Orders |
| `/orders/:id` | Customer Order Detail |

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
| `/admin/discounts` | Discount Management |

## Admin ↔ Customer Sync

| Admin Action | Customer Effect |
|--------------|-----------------|
| Add product | Product appears in listing |
| Set product to Inactive | Product hidden from listing |
| Update product price | Price reflects on product page |
| Delete product | Product removed from listing |
| Update order status | Status visible in customer order history |

| Customer Action | Admin Effect |
|-----------------|--------------|
| Place order | Order appears in admin order list with "Pending" status |
| Order placed | Product stock decremented (on Confirmed) |
| Register | Customer appears in customer list |

## Database

MySQL database with the following tables:

- **Category** — Product categories
- **Product** — Products with category relation
- **Order** — Customer orders
- **OrderItem** — Individual items in an order
- **OrderStatusHistory** — Order status change history
- **AdminUser** — Admin credentials (Argon2 hashed passwords)
- **Customer** — Customer accounts (Argon2 hashed passwords)
- **Discount** — Discount codes (percentage and fixed)
- **Wishlist** — Customer wishlists

See `DATA_MODEL.md` for detailed schema.
