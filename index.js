const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const cors = require('cors');

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// API routes
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM product', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(result);
  })
});

app.patch('/api/update-stock', (req, res) => {
  const cart = req.body

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Invalid cart data' });
  }

  const updates = cart.map(item => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE product SET product_stock = product_stock - ? WHERE product_id = ? AND product_stock >= ?';
      db.query(query, [item.quantity, item.id, item.quantity], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return reject(new Error(`Insufficient stock for item ID ${item.id}`));
        resolve(result);
      });
    });
  });

  Promise.all(updates)
    .then(results => res.json({ message: 'Stock updated', details: results }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile('cart.html', { root: path.join(__dirname, 'public') });
});

app.get('/checkout', (req, res) => {
  res.sendFile('checkout.html', { root: path.join(__dirname, 'public') });
});

app.get('/confirmation', (req, res) => {
  res.sendFile('confirmation.html', { root: path.join(__dirname, 'public') });
});

// Catch-all route for any unmatched routes
app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});