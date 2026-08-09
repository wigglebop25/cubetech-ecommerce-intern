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
- `sort` (string) — Sort by price (asc, desc)
- `page` (number) — Page number
- `limit` (number) — Items per page

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

# Sort by price
curl "http://localhost:3001/api/products?sort=asc"

# Pagination
curl "http://localhost:3001/api/products?page=1&limit=12"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Classic White T-Shirt",
      "image": "https://pixabay.com/get/...",
      "categoryId": 1,
      "description": "A comfortable everyday t-shirt made from 100% cotton.",
      "price": "499",
      "stock": 50,
      "lowStockThreshold": 5,
      "status": "Active",
      "createdAt": "2025-01-15T00:00:00Z",
      "category": {
        "id": 1,
        "name": "Clothing",
        "description": "Apparel and garments"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalItems": 43,
    "totalPages": 4
  }
}
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

**Headers:**
- `Authorization: Bearer <admin_token>`

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
  -H "Authorization: Bearer <admin_token>" \
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**Request Body:** Same as create (all fields optional)

**curl:**

```bash
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl -X DELETE http://localhost:3001/api/products/1 \
  -H "Authorization: Bearer <admin_token>"
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl -X PUT http://localhost:3001/api/categories/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl -X DELETE http://localhost:3001/api/categories/1 \
  -H "Authorization: Bearer <admin_token>"
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `status` (string) — Filter by status
- `search` (string) — Search by order ID or customer name
- `page` (number) — Page number
- `limit` (number) — Items per page

**curl:**

```bash
# Get all orders
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer <admin_token>"

# Filter by status
curl "http://localhost:3001/api/orders?status=Pending" \
  -H "Authorization: Bearer <admin_token>"

# Pagination
curl "http://localhost:3001/api/orders?page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

---

### Get Single Order

```
GET /api/orders/:id
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl http://localhost:3001/api/orders/ORD-001 \
  -H "Authorization: Bearer <admin_token>"
```

**Response:** Order object with items array

---

### Create Order

```
POST /api/orders
```

**Headers:**
- `Authorization: Bearer <customer_token>`

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
  "notes": "Leave at the door",
  "discountCode": "WELCOME10"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**Valid Statuses:** `Pending`, `Confirmed`, `Preparing`, `Shipped`, `Completed`, `Cancelled`

**curl:**

```bash
curl -X PUT http://localhost:3001/api/orders/ORD-001/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{ "status": "Confirmed" }'
```

---

## Customers

### Get All Customers

```
GET /api/customers
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl http://localhost:3001/api/customers \
  -H "Authorization: Bearer <admin_token>"
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

## Customer Authentication

### Register Customer

```
POST /api/customers/register
```

**Request Body:**
```json
{
  "name": "Juan Dela Cruz",
  "email": "juan@email.com",
  "password": "password123",
  "phone": "09171234567"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Dela Cruz",
    "email": "juan@email.com",
    "password": "password123",
    "phone": "09171234567"
  }'
```

**Response:**
```json
{
  "message": "Registration successful",
  "customer": {
    "id": 1,
    "name": "Juan Dela Cruz",
    "email": "juan@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login Customer

```
POST /api/customers/login
```

**Request Body:**
```json
{
  "email": "juan@email.com",
  "password": "password123"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "customer": {
    "id": 1,
    "name": "Juan Dela Cruz",
    "email": "juan@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Customer Profile

```
GET /api/customers/profile
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**curl:**

```bash
curl http://localhost:3001/api/customers/profile \
  -H "Authorization: Bearer <customer_token>"
```

---

### Update Customer Profile

```
PUT /api/customers/profile
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**curl:**

```bash
curl -X PUT http://localhost:3001/api/customers/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "name": "Updated Name",
    "phone": "09181234567"
  }'
```

---

## Customer Orders

### Get Customer Orders

```
GET /api/customer/orders
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**Query Parameters:**
- `page` (number) — Page number
- `limit` (number) — Items per page

**curl:**

```bash
curl http://localhost:3001/api/customer/orders \
  -H "Authorization: Bearer <customer_token>"
```

---

### Get Customer Order Detail

```
GET /api/customer/orders/:id
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**curl:**

```bash
curl http://localhost:3001/api/customer/orders/ORD-001 \
  -H "Authorization: Bearer <customer_token>"
```

---

### Cancel Customer Order

```
PUT /api/customer/orders/:id/cancel
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**curl:**

```bash
curl -X PUT http://localhost:3001/api/customer/orders/ORD-001/cancel \
  -H "Authorization: Bearer <customer_token>"
```

---

## Wishlist

### Get Wishlist

```
GET /api/wishlist
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**curl:**

```bash
curl http://localhost:3001/api/wishlist \
  -H "Authorization: Bearer <customer_token>"
```

---

### Add to Wishlist

```
POST /api/wishlist
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**Request Body:**
```json
{
  "productId": 1
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"productId": 1}'
```

---

### Remove from Wishlist

```
DELETE /api/wishlist/:productId
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**curl:**

```bash
curl -X DELETE http://localhost:3001/api/wishlist/1 \
  -H "Authorization: Bearer <customer_token>"
```

---

### Clear Wishlist

```
DELETE /api/wishlist
```

**Headers:**
- `Authorization: Bearer <customer_token>`

**curl:**

```bash
curl -X DELETE http://localhost:3001/api/wishlist \
  -H "Authorization: Bearer <customer_token>"
```

---

## Discounts

### Get All Discounts

```
GET /api/discounts
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl http://localhost:3001/api/discounts \
  -H "Authorization: Bearer <admin_token>"
```

---

### Create Discount

```
POST /api/discounts
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "code": "WELCOME10",
  "type": "percentage",
  "value": 10,
  "minOrder": 500,
  "maxUses": 100,
  "isActive": true
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/discounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "code": "WELCOME10",
    "type": "percentage",
    "value": 10,
    "minOrder": 500,
    "maxUses": 100,
    "isActive": true
  }'
```

---

### Update Discount

```
PUT /api/discounts/:id
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl -X PUT http://localhost:3001/api/discounts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "value": 15,
    "isActive": false
  }'
```

---

### Delete Discount

```
DELETE /api/discounts/:id
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl -X DELETE http://localhost:3001/api/discounts/1 \
  -H "Authorization: Bearer <admin_token>"
```

---

### Validate Discount Code

```
POST /api/discounts/validate
```

**Request Body:**
```json
{
  "code": "WELCOME10",
  "orderTotal": 1000
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/api/discounts/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "orderTotal": 1000
  }'
```

**Response:**
```json
{
  "discountId": 1,
  "discountCode": "WELCOME10",
  "discountAmount": 100,
  "discountType": "percentage",
  "remainingUses": 99
}
```

---

## Admin Authentication

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
    "username": "admin",
    "role": "admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl http://localhost:3001/api/stats \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "totalProducts": 43,
  "totalOrders": 7,
  "pendingOrders": 1,
  "completedOrders": 1,
  "totalCustomers": 3,
  "totalSales": 2012.64
}
```

---

## Analytics

### Get Dashboard Analytics

```
GET /api/analytics/dashboard
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl http://localhost:3001/api/analytics/dashboard \
  -H "Authorization: Bearer <admin_token>"
```

---

### Get Sales by Period

```
GET /api/analytics/sales
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `period` (string) — daily, weekly, monthly

**curl:**

```bash
curl "http://localhost:3001/api/analytics/sales?period=monthly" \
  -H "Authorization: Bearer <admin_token>"
```

---

### Get Top Products

```
GET /api/analytics/top-products
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl http://localhost:3001/api/analytics/top-products \
  -H "Authorization: Bearer <admin_token>"
```

---

### Get Revenue by Category

```
GET /api/analytics/revenue
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**curl:**

```bash
curl http://localhost:3001/api/analytics/revenue \
  -H "Authorization: Bearer <admin_token>"
```

---

## Export

### Export Orders to CSV

```
GET /api/orders/export
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `format` (string) — csv or json

**curl:**

```bash
curl "http://localhost:3001/api/orders/export?format=csv" \
  -H "Authorization: Bearer <admin_token>" \
  -o orders.csv
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
- `429` — Rate limit exceeded
- `500` — Server error

---

## Admin Credentials

```
Username: admin
Password: admin123
```
