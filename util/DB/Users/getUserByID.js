const getUserById = async (user_id, db) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [user_id], (err, row) => {
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

module.exports = { getUserById }