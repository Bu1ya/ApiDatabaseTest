const sqlite3 = require('sqlite3').verbose();

class DBController{

    db;
    
    constructor(databaseFile) {
        this.db = new sqlite3.Database(databaseFile, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
    }

    deleteUserById = (user_id) => {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM users WHERE user_id = ?`, [user_id], (err) => {
                if (err) {
                    return reject(err)
                }
                if (this.changes === 0) {
                    //nothing was changed
                    return resolve(null)
                }
                //user deleted
                resolve(true)
            });
        });
    }

    getAllUsers = () => {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM users`, [], (err, rows) => {
                if (err) {
                    return reject(err)
                }
                //users selected
                resolve(rows)
            });
        });
    }

    getUserById = async (user_id) => {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users WHERE user_id = ?`, [user_id], (err, row) => {
                if (err) {
                    return reject(err)
                }
                if (row) {
                    //user selected
                    resolve(row)
                } else {
                    //no user with id
                    resolve(null)
                }
            });
        });
    }

    insertUser = (first_name, last_name, age, cash_amount) => {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO users (first_name, last_name, age, cash_amount) VALUES (?, ?, ?, ?)`, 
                [first_name, last_name, age, cash_amount], (err) => {
                if (err) {
                    return reject(err)
                }
                //user with last id added
                resolve(this.lastID)
            });
        });
    };

    updateUser = (user_id, first_name, last_name, age, cash_amount) => {
        return new Promise((resolve, reject) => {
            const updates = {
                ...(first_name && { first_name }),
                ...(last_name && { last_name }),
                ...(age && { age }),
                ...(cash_amount && { cash_amount }),
                user_id
            };
    
            if (Object.keys(updates).length === 0) {
                return resolve(null)
            }
    
            let updateFields = []
            let args = []
    
            for (const [key, value] of Object.entries(updates)) {
                updateFields.push(`${key} = ?`)
                args.push(value);
            }
    
            const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`
            args.push(user_id)
    
            this.db.run(sql, args, (err) => {
                if (err) {
                    return reject(err)
                }
                if (this.changes === 0) {
                    //nothing was changed
                    return resolve(null)
                }
                //user was updated
                resolve(true)
            });
        });
    }

    closeDB = () =>{
        this.db.close((err) => {
            if (err) {
                console.error(err.message)
            }
            console.log('Database closed.')
            process.exit(0)
        });
    }
}

module.exports = {
    DBController
}