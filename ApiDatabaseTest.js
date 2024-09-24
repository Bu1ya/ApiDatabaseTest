const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const { deleteUserById } = require('./util/DB/Users/deleteUserById')
const { getAllUsers } = require('./util/DB/Users/getAllUsers')
const { getUserById } = require('./util/DB/Users/getUserByID')
const { insertUser } = require('./util/DB/Users/insertUser')
const { updateUser } = require('./util/DB/Users/updateUser')

const app = express()
const port = 3000;

app.use(express.json())


let db = new sqlite3.Database('AppDB.db', (err) => {
    if (err) {
        console.error(err.message)
    }
});

app.get('/', (req, res) => res.json({ message: 'Hello world!' }))

app.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers(db)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' })
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id, db)
        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user.' })
    }
});

app.post('/create', async (req, res) =>{
    if (!req.body) {
        return res.status(400).json({ error: 'Body must be provided' })
    }

    const { first_name, last_name, age, cash_amount } = req.body

    if (!first_name || !cash_amount) {
        return res.status(400).json({ error: 'first_name and cash_amount fields must be provided' })
    }

    try {
        await insertUser(first_name, last_name, age, cash_amount, db)
        res.status(201).json({ message: 'User created.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user.' })
    }
})

app.patch('/update', async (req, res) =>{
    const { first_name, last_name, age, cash_amount } = req.body
    const user_id = req.query.user_id

    try {
        await updateUser(user_id, first_name, last_name, age, cash_amount, db)
        res.json({ message: 'User info updated.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

app.delete('/delete', async (req, res) =>{
    try {
        await deleteUserById(req.query.user_id, db)
        res.json({ message: 'User deleted.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user.' })
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message)
        }
        console.log('Database closed.')
        process.exit(0)
    });
});

