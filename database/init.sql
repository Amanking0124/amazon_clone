DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  extra_images TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  shipping_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PLACED',
  total REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price REAL NOT NULL
);

INSERT OR REPLACE INTO users (id, name, email)
VALUES (1, 'Default User', 'user@example.com');

INSERT INTO products (name, description, category, price, stock, image_url, extra_images)
VALUES
(
  'Wireless Earbuds',
  'Premium noise-cancelling earbuds with 24-hour battery life, rich bass, and crystal clear calling.',
  'Electronics',
  79.99,
  120,
  'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80'
),
(
  'Smart Watch',
  'Fitness tracking smartwatch with heart rate monitor, sleep tracking, and AMOLED display.',
  'Electronics',
  149.99,
  80,
  'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=900&q=80'
),
(
  'Yoga Mat',
  'Eco-friendly non-slip yoga mat for stretching, yoga, and home workouts.',
  'Sports',
  29.99,
  150,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80'
),
(
  'Cotton Hoodie',
  'Soft cotton pullover hoodie with warm fleece lining and relaxed fit.',
  'Fashion',
  39.99,
  90,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=900&q=80'
),
(
  'Office Chair',
  'Ergonomic office chair with lumbar support and adjustable height.',
  'Home',
  189.99,
  45,
  'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80'
),
(
  'Coffee Maker',
  'Programmable coffee maker with fast brewing and auto shut-off.',
  'Home',
  59.99,
  60,
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80'
),
(
  'Gaming Mouse',
  'High-precision gaming mouse with ergonomic grip and programmable buttons.',
  'Electronics',
  49.99,
  140,
  'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1563297007-0686b7003af7?auto=format&fit=crop&w=900&q=80'
),
(
  'Backpack',
  'Durable backpack with laptop sleeve and multiple storage compartments.',
  'Fashion',
  44.99,
  110,
  'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80'
),
(
  'Bluetooth Speaker',
  'Portable Bluetooth speaker with rich sound and 12-hour battery backup.',
  'Electronics',
  69.99,
  95,
  'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80'
),
(
  'Running Shoes',
  'Lightweight running shoes with breathable mesh and cushioned sole.',
  'Fashion',
  89.99,
  70,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80'
),
(
  'Desk Lamp',
  'Minimal desk lamp with warm light and modern design.',
  'Home',
  34.99,
  100,
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80'
),
(
  'Mechanical Keyboard',
  'RGB mechanical keyboard with tactile switches for typing and gaming.',
  'Electronics',
  99.99,
  65,
  'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80'
),
(
  'Water Bottle',
  'Insulated stainless steel water bottle for gym and travel.',
  'Sports',
  19.99,
  200,
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1514862624749-3e7f2b9f47f6?auto=format&fit=crop&w=900&q=80,https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80'
);

DELETE FROM carts;
DELETE FROM orders;
DELETE FROM order_items;