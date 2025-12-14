# Sweet Shop Management System - Walkthrough

## Setup Instructions

> [!IMPORTANT]
> **Database Configuration Required**
> Before running the app, you MUST configure your PostgreSQL database.
> 1. Create a `.env` file in the root directory.
> 2. Add your connection string: `DATABASE_URL="postgresql://user:password@localhost:5432/sweetshop?schema=public"`
> 3. Run migrations: `npx prisma migrate dev --name init`
> 4. Seed the database (optional): `npx prisma db seed`

## Features

### 1. Dashboard (`/`)
- View total revenue, total orders, and product count.
- Real-time calculations based on order history.

### 2. Inventory Management (`/inventory`)
- **Add New Sweet**: Form to create new products with name, price, stock, and category.
- **View Inventory**: Table listing all products with their stock levels.
- **Stock Tracking**: Stock is displayed in real-time.

### 3. Point of Sale (POS) (`/pos`)
- **Product Grid**: Visual grid of all available sweets, filterable by category.
- **Cart System**: Add items to cart, adjust quantities, or remove items.
- **Checkout**: Processes the order, calculates total, and automatically decrements stock.

## Testing the Application

1. **Start the Server**:
   ```bash
   npm run dev
   ```
2. **Open Browser**: Go to [http://localhost:3000](http://localhost:3000)
3. **Verify Inventory**:
   - Go to "Inventory".
   - Add a product (e.g., "Vanilla Bean Cupcake", Price: 3.50, Stock: 20, Category: Cakes).
   - Verify it appears in the table.
4. **Verify POS**:
   - Go to "POS".
   - Click "Cakes" category to filter.
   - Click the cupcake to add to cart.
   - Click "Process Payment".
5. **Verify Dashboard**:
   - Return to Dashboard.
   - Revenue should increase by $3.50.

## Troubleshooting
- **Prisma Client Issues**: If you see errors about `prisma`, run `npx prisma generate` after fixing your `.env` file.
- **Missing Dependencies**: Run `npm install` to ensure all UI libraries are installed.
