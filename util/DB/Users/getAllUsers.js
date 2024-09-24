const getAllUsers = (db) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if (err) {
                return reject(err)
            }
            //users selected
            resolve(rows)
        });
    });
}

module.exports = { getAllUsers }