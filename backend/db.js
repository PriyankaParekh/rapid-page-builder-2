const mysql = require('mysql2/promise');

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'priyanka',
            password: 'qwerty@1234',
            database: 'Project'
        });
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
}

// Export the connection object
module.exports = connectToDatabase;
