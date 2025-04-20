const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');

const port = 3000;

app.use(express.static(__dirname));
app.use(express.json())

app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM product', (err, result) => {
    if(err) {
      return res.status(500).json({error: 'DB error'});
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


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});