const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');

const port = 3000;

app.use(express.static(__dirname));

app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM product', (err, result) => {
    if(err) {
      return res.status(500).json({error: 'DB error'});
    }
    res.json(result);
  })
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});