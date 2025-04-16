const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'lzq19961217',
  database: 'xx_beer_db'
});

connection.connect(err => {
  if(err) {
    console.error('database connection failed:', err);
    return
  }
  console.log('connected to mysql');
});

module.exports = connection;