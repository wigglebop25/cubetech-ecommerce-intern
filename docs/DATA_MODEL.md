# Data Model

## Product

```json
{
  "id": 1,
  "name": "Classic White T-Shirt",
  "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
  "category": "Clothing",
  "description": "A comfortable everyday t-shirt made from 100% cotton.",
  "price": 499,
  "stock": 50,
  "status": "Active"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier |
| name | string | yes | Product name |
| image | string | yes | Image URL |
| category | string | yes | Must match a category name |
| description | string | yes | Short description |
| price | number | yes | Must be > 0 |
| stock | number | yes | 0 = Out of Stock |
| status | string | yes | Active, Inactive, Out of Stock |

## Category

```json
{
  "id": 1,
  "name": "Clothing",
  "description": "Apparel and garments"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier |
| name | string | yes | Category name |
| description | string | no | Short description |

## Order

```json
{
  "id": "ORD-M1N2O3-a4b5",
  "customerName": "Juan Dela Cruz",
  "email": "juan@email.com",
  "phone": "09171234567",
  "address": "123 Main St, Quezon City",
  "items": [
    { "productId": 1, "name": "Classic White T-Shirt", "price": 499, "quantity": 2 }
  ],
  "subtotal": 998,
  "total": 998,
  "paymentMethod": "Cash on Delivery",
  "status": "Pending",
  "orderDate": "2025-01-15",
  "notes": "Leave at the door"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Generated order number |
| customerName | string | yes | Customer full name |
| email | string | yes | Valid email format |
| phone | string | yes | 10-11 digit number |
| address | string | yes | Delivery address |
| items | array | yes | Array of order items |
| subtotal | number | yes | Sum of item totals |
| total | number | yes | Final amount |
| paymentMethod | string | yes | COD, E-Wallet, or Bank Transfer |
| status | string | yes | See order statuses |
| orderDate | string | yes | YYYY-MM-DD format |
| notes | string | no | Optional order notes |

## Customer

Derived from orders. No separate registration needed.

```json
{
  "name": "Juan Dela Cruz",
  "email": "juan@email.com",
  "phone": "09171234567",
  "orderCount": 2,
  "totalSpent": 2497,
  "status": "Active"
}
```

| Field | Type | Notes |
|-------|------|-------|
| name | string | From order data |
| email | string | Unique identifier |
| phone | string | From order data |
| orderCount | number | Auto-calculated |
| totalSpent | number | Auto-calculated |
| status | string | Always "Active" |

## Order Statuses

| Status | Description |
|--------|-------------|
| Pending | Order placed, not yet processed |
| Confirmed | Order confirmed by admin |
| Preparing | Order being prepared |
| Shipped | Order out for delivery |
| Completed | Order delivered successfully |
| Cancelled | Order cancelled |
