const updateUser = (user_id, first_name, last_name, age, cash_amount, db) => {
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

        db.run(sql, args, (err) => {
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

module.exports = { updateUser }