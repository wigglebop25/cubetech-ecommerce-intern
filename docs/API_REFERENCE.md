# API Reference

Base URL: `http://localhost:3001`

---

## Health Check

### Get API Health Status

```
GET /api/health
```

**curl:**

```bash
curl http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

## Products

### Get All Products

```
GET /api/products
```

**Query Parameters:**
- `category` (string) — Filter by category name
- `status` (string) — Filter by status (Active, Inactive, Out_of_Stock)
- `search` (string) — Search by product name

**curl:**

```bash
# Get all products
curl http://localhost:3001/api/products

# Filter by category
curl "http://localhost:3001/api/products?category=Clothing"

# Filter by status
curl "http://localhost:3001/api/products?status=Active"

# Search by name
curl "http://localhost:3001/api/products?search=shirt"

# Combine filters
curl "http://localhost:3001/api/products?category=Clothing&status=Active"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Classic White T-Shirt",
    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    "categoryId": 1,
    "description": "A comfortable everyday t-shirt made from 100% cotton.",
    "price": "499",
    "stock": 50,
    "status": "Active",
    "createdAt": "2025-01-15T00:00:00Z",
    "category": {
      "id": 1,
      "name": "Clothing",
      "description": "Apparel and garments"
    }
  }
]
```

---

### Get Single Product

```
GET /api/products/:id
```

**curl:**

```bash
curl http://localhost:3001/api/products/1
```

**Response:** Product object or `404 { "error": "Product not found" }`

---

### Create Product

```
POST /api/products
```

**Request Body:**
```json
{
  "name": "New Product",
  "image": "https://via.placeholder.com/400",
  "categoryId": 1,
  "description": "Product description",
  "price": 999,
  "stock": 10,
  "status": "Active"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "image": "https://via.placeholder.com/400",
    "categoryId": 1,
    "description": "Product description",
    "price": 999,
    "stock": 10,
    "status": "Active"
  }'
```

**Response (201):** Created product object

---

### Update Product

```
PUT /api/products/:id
```

**Request Body:** Same as create (all fields optional)

**curl:**

```bash
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 599,
    "stock": 25
  }'
```

**Response:** Updated product object

---

### Delete Product

```
DELETE /api/products/:id
```

**curl:**

```bash
curl -X DELETE http://localhost:3001/api/products/1
```

**Response:** `{ "message": "Product deleted" }`

---

## Categories

### Get All Categories

```
GET /api/categories
```

**curl:**

```bash
curl http://localhost:3001/api/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Clothing",
    "description": "Apparel and garments",
    "createdAt": "2025-01-15T00:00:00Z",
    "_count": {
      "products": 3
    }
  }
]
```

---

### Create Category

```
POST /api/categories
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Category description"
  }'
```

---

### Update Category

```
PUT /api/categories/:id
```

**curl:**

```bash
curl -X PUT http://localhost:3001/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "description": "Updated description"
  }'
```

---

### Delete Category

```
DELETE /api/categories/:id
```

**curl:**

```bash
curl -X DELETE http://localhost:3001/api/categories/1
```

**Error (if products exist):**
```json
{
  "error": "Cannot delete category with 3 product(s). Remove or reassign products first."
}
```

---

## Orders

### Get All Orders

```
GET /api/orders
```

**Query Parameters:**
- `status` (string) — Filter by status
- `search` (string) — Search by order ID or customer name

**curl:**

```bash
# Get all orders
curl http://localhost:3001/api/orders

# Filter by status
curl "http://localhost:3001/api/orders?status=Pending"

# Search
curl "http://localhost:3001/api/orders?search=Juan"
```

---

### Get Single Order

```
GET /api/orders/:id
```

**curl:**

```bash
curl http://localhost:3001/api/orders/ORD-001
```

**Response:** Order object with items array

---

### Create Order

```
POST /api/orders
```

**Request Body:**
```json
{
  "customerName": "Juan Dela Cruz",
  "email": "juan@email.com",
  "phone": "09171234567",
  "address": "123 Main St, Quezon City",
  "items": [
    {
      "productId": 1,
      "name": "Classic White T-Shirt",
      "price": 499,
      "quantity": 2
    }
  ],
  "subtotal": 998,
  "total": 998,
  "paymentMethod": "Cash on Delivery",
  "notes": "Leave at the door"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Juan Dela Cruz",
    "email": "juan@email.com",
    "phone": "09171234567",
    "address": "123 Main St, Quezon City",
    "items": [
      {
        "productId": 1,
        "name": "Classic White T-Shirt",
        "price": 499,
        "quantity": 2
      }
    ],
    "subtotal": 998,
    "total": 998,
    "paymentMethod": "Cash on Delivery",
    "notes": ""
  }'
```

---

### Update Order Status

```
PUT /api/orders/:id/status
```

**Valid Statuses:** `Pending`, `Confirmed`, `Preparing`, `Shipped`, `Completed`, `Cancelled`

**curl:**

```bash
curl -X PUT http://localhost:3001/api/orders/ORD-001/status \
  -H "Content-Type: application/json" \
  -d '{ "status": "Confirmed" }'
```

---

## Customers

### Get All Customers

```
GET /api/customers
```

**curl:**

```bash
curl http://localhost:3001/api/customers
```

**Response:**
```json
[
  {
    "name": "Juan Dela Cruz",
    "email": "juan@email.com",
    "phone": "09171234567",
    "orderCount": 1,
    "totalSpent": 1797,
    "status": "Active"
  }
]
```

---

## Authentication

### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Success Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

---

## Statistics

### Get Dashboard Stats

```
GET /api/stats
```

**curl:**

```bash
curl http://localhost:3001/api/stats
```

**Response:**
```json
{
  "totalProducts": 12,
  "totalOrders": 5,
  "pendingOrders": 1,
  "completedOrders": 1,
  "totalCustomers": 5,
  "totalSales": 1797
}
```

---

## Error Responses

All endpoints may return errors in this format:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` — Success
- `201` — Created
- `400` — Bad request / Validation error
- `401` — Unauthorized
- `404` — Not found
- `500` — Server error

---

## Admin Credentials

```
Username: admin
Password: admin123
```
