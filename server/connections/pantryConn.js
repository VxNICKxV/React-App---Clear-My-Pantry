
// import pg from pool to interact with postgress
const { Pool } = require('pg');
// imports variables from env file
require('dotenv').config();
// use values from .env file to setup a database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// database connection test
const connectDb = async () => {
    try {
        // client tries to interact with the pool
        await pool.connect();
        console.log('Connected to the database successfully!');
    } catch (err) {
        // logs error message to the db if nescessary
        console.error('Error connecting to the database:', err);
        // exit protocol if connection fails and sends an error code
        process.exit(1);
    }
};

module.exports = { pool, connectDb };




















