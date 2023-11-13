// Import the ESM versions of the required functions
import mysql from 'mysql';
import dotenv from 'dotenv'

dotenv.config();

// Connect to MySQL database hosted by Amazon RDS
const db = mysql.createConnection(process.env.DATABASE_URL);

// Log if connection was successful
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database', err);
    } else {
        console.log('Connected to MySQL database')
    }
});

export default db;