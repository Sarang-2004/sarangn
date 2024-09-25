const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'my_project_db',
    username: 'postgres',
    password: '12345678',
    port: 5432,
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to database. Current time:', res.rows[0].now);
    }
});

module.exports = pool;

