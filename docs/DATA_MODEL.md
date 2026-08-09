# Data Model

## Product

```json
{
  "id": 1,
  "name": "Classic White T-Shirt",
  "image": "https://pixabay.com/get/...",
  "category": "Clothing",
  "description": "A comfortable everyday t-shirt made from 100% cotton.",
  "price": 499,
  "stock": 50,
  "lowStockThreshold": 5,
  "status": "Active"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier (auto-increment) |
| name | string | yes | Product name |
| image | string | yes | Image URL (Pixabay or placeholder) |
| categoryId | number | yes | Foreign key to Category |
| description | string | yes | Short description |
| price | Decimal | yes | Must be > 0 |
| stock | number | yes | 0 = Out of Stock |
| lowStockThreshold | number | no | Default: 5 |
| status | string | yes | Active, Inactive, Out_of_Stock |
| createdAt | DateTime | yes | Auto-generated |

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
| id | number | yes | Unique identifier (auto-increment) |
| name | string | yes | Unique category name |
| description | string | no | Short description |
| createdAt | DateTime | yes | Auto-generated |

## Order

```json
{
  "id": "ORD-001",
  "customerName": "Juan Dela Cruz",
  "email": "juan@email.com",
  "phone": "09171234567",
  "address": "123 Main St, Quezon City",
  "items": [
    { "productId": 1, "productName": "Classic White T-Shirt", "price": 499, "quantity": 2 }
  ],
  "subtotal": 998,
  "tax": 119.76,
  "shippingCost": 0,
  "total": 1117.76,
  "paymentMethod": "Cash on Delivery",
  "status": "Pending",
  "orderDate": "2025-01-15",
  "notes": "Leave at the door",
  "discountId": 1
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Generated order number (ORD-001, ORD-002, etc.) |
| customerName | string | yes | Customer full name |
| email | string | yes | Valid email format |
| phone | string | yes | 10-11 digit number |
| address | string | yes | Delivery address |
| subtotal | Decimal | yes | Sum of item totals |
| tax | Decimal | yes | 12% VAT |
| shippingCost | Decimal | yes | Based on subtotal |
| total | Decimal | yes | Final amount |
| paymentMethod | string | yes | Cash on Delivery, E-Wallet, Bank Transfer |
| status | string | yes | See order statuses |
| orderDate | DateTime | yes | Auto-generated |
| notes | string | no | Optional order notes |
| discountId | number | no | Foreign key to Discount |
| createdAt | DateTime | yes | Auto-generated |

## OrderItem

```json
{
  "id": 1,
  "orderId": "ORD-001",
  "productId": 1,
  "productName": "Classic White T-Shirt",
  "price": 499,
  "quantity": 2
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier (auto-increment) |
| orderId | string | yes | Foreign key to Order |
| productId | number | yes | Foreign key to Product |
| productName | string | yes | Product name at time of order |
| price | Decimal | yes | Price at time of order |
| quantity | number | yes | Quantity ordered |

## OrderStatusHistory

```json
{
  "id": 1,
  "orderId": "ORD-001",
  "status": "Confirmed",
  "notes": "Order confirmed by admin",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier (auto-increment) |
| orderId | string | yes | Foreign key to Order |
| status | string | yes | Order status |
| notes | string | no | Optional notes |
| createdAt | DateTime | yes | Auto-generated |

## Customer

```json
{
  "id": 1,
  "name": "Juan Dela Cruz",
  "email": "juan@email.com",
  "phone": "09171234567",
  "address": "123 Main St, Quezon City"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier (auto-increment) |
| name | string | yes | Customer full name |
| email | string | yes | Unique, valid email format |
| password | string | yes | Argon2 hashed password |
| phone | string | no | Phone number |
| address | string | no | Delivery address |
| createdAt | DateTime | yes | Auto-generated |

## AdminUser

```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier (auto-increment) |
| username | string | yes | Unique username |
| password | string | yes | Argon2 hashed password |
| role | string | yes | Always "admin" |
| createdAt | DateTime | yes | Auto-generated |

## Discount

```json
{
  "id": 1,
  "code": "WELCOME10",
  "type": "percentage",
  "value": 10,
  "minOrder": 500,
  "maxUses": 100,
  "usedCount": 5,
  "expiresAt": null,
  "isActive": true
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier (auto-increment) |
| code | string | yes | Unique discount code |
| type | string | yes | "percentage" or "fixed" |
| value | Decimal | yes | Percentage (1-100) or fixed amount |
| minOrder | Decimal | no | Minimum order amount (default: 0) |
| maxUses | number | no | Maximum usage count (null = unlimited) |
| usedCount | number | yes | Current usage count (default: 0) |
| expiresAt | DateTime | no | Expiration date (null = no expiration) |
| isActive | boolean | yes | Active/inactive status |
| createdAt | DateTime | yes | Auto-generated |

## Wishlist

```json
{
  "id": 1,
  "customerId": 1,
  "productId": 1
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | yes | Unique identifier (auto-increment) |
| customerId | number | yes | Foreign key to Customer |
| productId | number | yes | Foreign key to Product |
| createdAt | DateTime | yes | Auto-generated |

## Order Statuses

| Status | Description |
|--------|-------------|
| Pending | Order placed, not yet processed |
| Confirmed | Order confirmed by admin (stock decremented) |
| Preparing | Order being prepared |
| Shipped | Order out for delivery |
| Completed | Order delivered successfully |
| Cancelled | Order cancelled (stock restored if was Confirmed+) |

## Payment Methods

| Method | Description |
|--------|-------------|
| Cash on Delivery | Pay on delivery |
| E-Wallet | Electronic wallet payment |
| Bank Transfer | Bank transfer payment |

## Shipping Calculation

| Subtotal | Shipping Cost |
|----------|---------------|
| >= ₱2,000 | Free |
| >= ₱1,000 | ₱99 |
| < ₱1,000 | ₱149 |

## Tax Calculation

- Tax rate: 12% VAT
- Applied to: subtotal - discountAmount
- Formula: `tax = (subtotal - discountAmount) * 0.12`

## Discount Calculation

### Percentage Discount
```
discountAmount = (subtotal * value) / 100
```

### Fixed Discount
```
discountAmount = value
```

### Final Calculation
```
subtotalAfterDiscount = subtotal - discountAmount
tax = subtotalAfterDiscount * 0.12
total = subtotalAfterDiscount + tax + shippingCost
```
