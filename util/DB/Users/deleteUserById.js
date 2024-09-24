const deleteUserById = (user_id, db) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM users WHERE user_id = ?`, [user_id], (err) => {
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

module.exports = { deleteUserById }