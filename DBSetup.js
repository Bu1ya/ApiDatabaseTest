const sqlite3 = require('sqlite3').verbose();

const initDatabase = () => {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('AppDB.db', (err) => {
            if (err) {
                console.error(`Error connecting to the database: ${err.message}`);
                return reject(err);
            }
            console.log('Connected to the AppDB.db SQLite database.');

            db.run(`CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT,
                age INTEGER,
                cash_amount BIGINT NOT NULL
            )`, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(db); // resolve with the database connection
            });
        });
    });
};

initDatabase()
    .then(db => {
        db.close((err) => {
            if (err) {
                console.error(`Error closing the database connection: ${err.message}`);
            }
            console.log('Closed the database connection.');
        });
    })
    .catch(err => {
        console.error(`Database initialization failed: ${err.message}`);
    });
