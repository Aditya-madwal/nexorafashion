# API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained from the `/api/login` endpoint.

---

## Table of Contents

- [General Endpoints](#general-endpoints)
- [Authentication Endpoints](#authentication-endpoints)
- [User Endpoints](#user-endpoints)
- [Product Endpoints](#product-endpoints)
- [Cart Endpoints](#cart-endpoints)
- [Checkout Endpoints](#checkout-endpoints)

---

## General Endpoints

### Welcome

**GET** `/`

Returns a welcome message.

**Query Parameters:** None

**Request Body:** None

**Response:**

```json
"welcome"
```

---

## Authentication Endpoints

### Register User

**POST** `/api/register`

Register a new user account.

**Query Parameters:** None

**Request Body:**

```json
{
  "username": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)"
}
```

**Example Request:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**

```json
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400` - All fields are required / User already exists
- `500` - Server error

---

### Login

**POST** `/api/login`

Authenticate user and receive JWT token.

**Query Parameters:** None

**Request Body:**

```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Example Request:**

```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

- `404` - User not found
- `401` - Invalid password
- `500` - Server error

---

### Logout

**GET** `/api/logout`

Logout user (clears cookie).

**Query Parameters:** None

**Request Body:** None

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### Get Current User Profile

**GET** `/api/showme`

**Authentication:** Required (Bearer token)

Get the currently authenticated user's profile information.

**Query Parameters:** None

**Request Body:** None

**Success Response (200):**

```json
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401` - Unauthorized (no token or invalid token)
- `404` - User not found
- `500` - Server error

---

### Get User Profile by Username

**GET** `/api/user/:username`

**Authentication:** Required (Bearer token)

Get user profile information by username.

**Query Parameters:** None

**URL Parameters:**

- `username` (string, required) - The username of the user

**Request Body:** None

**Example Request:**

```
GET /api/user/johndoe
```

**Success Response (200):**

```json
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

### Protected Route Example

**GET** `/api/protected`

**Authentication:** Required (Bearer token)

Example protected route that requires authentication.

**Query Parameters:** None

**Request Body:** None

**Success Response (200):**

```json
{
  "message": "Access granted to protected route"
}
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

---

## Product Endpoints

### Create Product

**POST** `/api/products`

**Authentication:** Required (Bearer token)

Create a new product in the system.

**Query Parameters:** None

**Request Body:**

```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "price": "number (required, min: 0)",
  "stock": "number (optional, min: 0, default: 0)",
  "image": "string (optional) - Image URL or path"
}
```

**Example Request:**

```json
{
  "name": "Laptop",
  "description": "High-performance laptop for developers",
  "price": 1299.99,
  "stock": 50,
  "image": "https://example.com/images/laptop.jpg"
}
```

**Success Response (201):**

```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "product_id",
    "name": "Laptop",
    "description": "High-performance laptop for developers",
    "price": 1299.99,
    "stock": 50,
    "image": "https://example.com/images/laptop.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Name and price are required / Price must be greater than or equal to 0 / Stock must be greater than or equal to 0
- `401` - Unauthorized
- `500` - Server error

---

### Get Products with Pagination

**GET** `/api/products`

Get a paginated list of all products.

**Authentication:** Not required

**Query Parameters:**

- `page` (integer, optional) - Page number (default: 1)
- `limit` (integer, optional) - Items per page (default: 10)

**Request Body:** None

**Example Request:**

```
GET /api/products?page=1&limit=10
```

**Success Response (200):**

```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "stock": 100,
      "image": "https://example.com/images/product.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error Responses:**

- `500` - Server error

---

## Cart Endpoints

### Add Item to Cart

**POST** `/api/cart`

**Authentication:** Required (Bearer token)

Add a product to the user's cart. If the item already exists, it updates the quantity.

**Query Parameters:** None

**Request Body:**

```json
{
  "productId": "string (required) - MongoDB ObjectId",
  "qty": "number (required, min: 1)"
}
```

**Example Request:**

```json
{
  "productId": "507f1f77bcf86cd799439011",
  "qty": 2
}
```

**Success Response (201 - New Item / 200 - Updated Item):**

```json
{
  "message": "Item added to cart",
  "cartItem": {
    "_id": "cart_item_id",
    "userId": "user_id",
    "productId": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 29.99
    },
    "quantity": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - productId and qty are required / Quantity must be greater than 0
- `401` - Unauthorized
- `404` - Product not found
- `500` - Server error

---

### Get Cart Items

**GET** `/api/cart`

**Authentication:** Required (Bearer token)

Get all items in the user's cart with calculated totals.

**Query Parameters:** None

**Request Body:** None

**Success Response (200):**

```json
{
  "items": [
    {
      "id": "cart_item_id",
      "product": {
        "id": "product_id",
        "name": "Product Name",
        "price": 29.99,
        "description": "Product description",
        "stock": 100
      },
      "quantity": 2,
      "subtotal": 59.98,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 59.98,
  "itemCount": 1
}
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

---

### Remove Item from Cart

**DELETE** `/api/cart/:id`

**Authentication:** Required (Bearer token)

Remove a specific item from the user's cart.

**Query Parameters:** None

**URL Parameters:**

- `id` (string, required) - The cart item ID to remove

**Request Body:** None

**Example Request:**

```
DELETE /api/cart/507f1f77bcf86cd799439011
```

**Success Response (200):**

```json
{
  "message": "Item removed from cart",
  "deletedItem": {
    "_id": "cart_item_id",
    "userId": "user_id",
    "productId": "product_id",
    "quantity": 2
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Cart item not found
- `500` - Server error

---

## Checkout Endpoints

### Process Checkout

**POST** `/api/checkout`

**Authentication:** Required (Bearer token)

Process checkout and generate a mock receipt with total and timestamp.

**Query Parameters:** None

**Request Body:** None

**Success Response (200):**

```json
{
  "message": "Checkout successful",
  "receipt": {
    "receiptId": "RCP-1704067200000-ABC123XYZ",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "items": [
      {
        "productName": "Product Name",
        "quantity": 2,
        "unitPrice": 29.99,
        "subtotal": 59.98
      }
    ],
    "total": 59.98,
    "paymentMethod": "Mock Payment",
    "status": "Completed"
  }
}
```

**Error Responses:**

- `400` - Cart is empty
- `401` - Unauthorized
- `500` - Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error message description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid or missing token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

1. JWT tokens expire after 30 seconds (as configured in the login endpoint).
2. The cart system automatically updates quantities if the same product is added multiple times.
3. Product endpoints do not require authentication.
4. All cart and checkout operations are user-specific and require authentication.
5. The checkout endpoint returns a mock receipt and does not process actual payments.
