# Amazon Clone E-Commerce Platform

A full-stack e-commerce web application that replicates Amazon's design and functionality.

## Features

### Core Features ✅
- **Product Listing Page**: Grid layout with product cards, search functionality, and category filtering
- **Product Detail Page**: Image carousel, product specifications, add to cart, and buy now options
- **Shopping Cart**: View items, update quantities, remove items, and cart summary
- **Order Placement**: Checkout with shipping address form, order summary, and confirmation

### Bonus Features ✅
- Responsive design (mobile, tablet, desktop)
- Clean Amazon-inspired UI/UX

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express.js
- **Database**: SQLite (for easy setup)
- **Styling**: CSS Modules

## Project Structure

```
amazon_clone/
├── backend/
│   ├── index.js          # Express server and API routes
│   ├── package.json
│   ├── amazon_clone.db   # SQLite database
│   └── .env
├── database/
│   └── init.sql          # Database schema and sample data
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   │   ├── Header.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   └── OrderConfirmation.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   npm run init-db
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` or `http://localhost:5174`

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional search and category filters)
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

## Database Schema

### Tables
- **users**: User information
- **products**: Product catalog
- **carts**: Shopping cart items
- **orders**: Order information
- **order_items**: Order line items

## Sample Data

The database is seeded with sample products across different categories:
- Electronics (Wireless Earbuds, Smart Watch)
- Sports (Yoga Mat)
- Fashion (Hoodie)
- Home (Cookware Set)

## Assumptions Made

1. **Single User**: The application assumes a default user (no authentication required)
2. **No Payment Processing**: Order placement is simulated without real payment integration
3. **Stock Management**: Basic stock tracking is implemented but not enforced
4. **Shipping**: Fixed shipping rates ($5.99 for orders under $25, free for $25+)
5. **Tax**: Fixed 8% tax rate applied to all orders

## Development Notes

- The application uses SQLite for easy setup and deployment
- All API calls include proper error handling
- The UI closely follows Amazon's design patterns
- Responsive design works across different screen sizes
- Cart state is managed server-side for persistence

## Deployment

The application can be deployed to:
- **Frontend**: Vercel, Netlify, or any static hosting service
- **Backend**: Render, Railway, or any Node.js hosting service
- **Database**: SQLite file can be included in deployment or migrated to PostgreSQL/MySQL

## Future Enhancements

- User authentication and registration
- Payment gateway integration
- Order history and tracking
- Wishlist functionality
- Product reviews and ratings
- Admin panel for product management
- Email notifications
- Advanced search and filtering