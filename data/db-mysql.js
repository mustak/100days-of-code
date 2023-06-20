const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: 'blog',
});

// console.log(process.env.USER);

module.exports = pool;
