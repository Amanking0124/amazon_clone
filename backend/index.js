require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./amazon_clone.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', (req, res) => {
  db.all(
    'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != "" ORDER BY category ASC',
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch categories' });
      }
      res.json(rows.map((row) => row.category));
    }
  );
});

app.get('/api/products', (req, res) => {
  const { search, category, page = 1, limit = 16 } = req.query;
  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name LIKE ?`);
  }

  if (category && category !== 'All') {
    values.push(category);
    conditions.push(`category = ?`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.max(parseInt(limit, 10) || 16, 1);
  const offset = (safePage - 1) * safeLimit;

  const productQuery = `SELECT * FROM products ${where} ORDER BY id LIMIT ? OFFSET ?`;

  db.get(`SELECT COUNT(*) AS total FROM products ${where}`, values, (countErr, countRow) => {
    if (countErr) {
      console.error(countErr);
      return res.status(500).json({ error: 'Failed to fetch product count' });
    }

    db.all(productQuery, [...values, safeLimit, offset], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

      res.json({
        data: rows,
        total: countRow.total,
        page: safePage,
        limit: safeLimit
      });
    });
  });
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch product details' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(row);
  });
});

app.get('/api/cart', (req, res) => {
  const query = `
    SELECT c.id as cart_id, p.*, c.quantity
    FROM carts c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `;

  db.all(query, [1], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    res.json(rows);
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  const checkQuery = 'SELECT * FROM carts WHERE user_id = ? AND product_id = ?';

  db.get(checkQuery, [1, productId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to add to cart' });
    }

    if (row) {
      const updateQuery = 'UPDATE carts SET quantity = quantity + ? WHERE id = ?';
      db.run(updateQuery, [quantity, row.id], function(updateErr) {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Failed to update cart' });
        }

        res.json({ status: 'ok' });
      });
    } else {
      const insertQuery = 'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)';
      db.run(insertQuery, [1, productId, quantity], function(insertErr) {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ error: 'Failed to add to cart' });
        }

        res.json({ status: 'ok' });
      });
    }
  });
});

app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { quantity } = req.body;

  if (quantity <= 0) {
    db.run('DELETE FROM carts WHERE id = ?', [id], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update cart' });
      }

      res.json({ status: 'ok' });
    });
  } else {
    db.run('UPDATE carts SET quantity = ? WHERE id = ?', [quantity, id], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update cart' });
      }

      res.json({ status: 'ok' });
    });
  }
});

app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.run('DELETE FROM carts WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to remove item from cart' });
    }

    res.json({ status: 'ok' });
  });
});

app.post('/api/orders', (req, res) => {
  const { shippingAddress } = req.body;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.all(
      `
      SELECT c.product_id, c.quantity, p.price
      FROM carts c
      JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?
      `,
      [1],
      (err, cartRows) => {
        if (err) {
          db.run('ROLLBACK');
          console.error(err);
          return res.status(500).json({ error: 'Failed to place order' });
        }

        if (!cartRows.length) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Cart is empty' });
        }

        const total = cartRows.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderQuery =
          'INSERT INTO orders (user_id, shipping_address, status, total) VALUES (?, ?, ?, ?)';

        db.run(orderQuery, [1, JSON.stringify(shippingAddress), 'PLACED', total], function(orderErr) {
          if (orderErr) {
            db.run('ROLLBACK');
            console.error(orderErr);
            return res.status(500).json({ error: 'Failed to place order' });
          }

          const orderId = this.lastID;
          let completed = 0;
          const totalItems = cartRows.length;

          cartRows.forEach((item) => {
            const orderItemQuery =
              'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';

            db.run(
              orderItemQuery,
              [orderId, item.product_id, item.quantity, item.price],
              (itemErr) => {
                if (itemErr) {
                  db.run('ROLLBACK');
                  console.error(itemErr);
                  return res.status(500).json({ error: 'Failed to place order' });
                }

                completed += 1;

                if (completed === totalItems) {
                  db.run('DELETE FROM carts WHERE user_id = ?', [1], (deleteErr) => {
                    if (deleteErr) {
                      db.run('ROLLBACK');
                      console.error(deleteErr);
                      return res.status(500).json({ error: 'Failed to place order' });
                    }

                    db.run('COMMIT');
                    res.json({ orderId });
                  });
                }
              }
            );
          });
        });
      }
    );
  });
});

app.get('/api/orders', (req, res) => {
  db.all(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [1],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }

      res.json(rows);
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});