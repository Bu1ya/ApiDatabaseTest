const insertUser = (first_name, last_name, age, cash_amount, db) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (first_name, last_name, age, cash_amount) VALUES (?, ?, ?, ?)`, 
            [first_name, last_name, age, cash_amount], (err) => {
            if (err) {
                return reject(err)
            }
            //user with last id added
            resolve(this.lastID)
        });
    });
};


module.exports = { insertUser }