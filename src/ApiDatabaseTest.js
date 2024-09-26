require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const { body, param, query } = require('express-validator');
const { checkValidationErrors } = require('./middleware/checkValidationErrors.js')
const { REQUEST_LIMITS } = require('./constants/constants.js');
const { DBController } = require('./models/DBController');

app = express()

app.use(helmet())
app.use(xss())
app.use(express.json())

const limiter = rateLimit({
    windowMs: REQUEST_LIMITS.RATE_LIMIT_DURATION_MS,
    max: REQUEST_LIMITS.MAX_REQUESTS_PER_WINDOW,
    message: REQUEST_LIMITS.MESSAGE,
})

app.use(limiter)

const dbController = new DBController('./models/AppDB.db')

app.get('/', (req, res) => res.json({ message: 'Hello world!' }))

app.get('/users', async (req, res) => {
    try {
        const users = await dbController.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' })
    }
});

app.get('/users/:id', [
    param('id').isInt().withMessage('User ID must be an integer').toInt(),
    checkValidationErrors
], async (req, res) => {
    try {
        const user = await dbController.getUserById(req.params.id)
        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user.' })
    }
});

app.post('/create',[
    body('first_name').notEmpty().withMessage('First name is required').trim().escape(),
    body('last_name').optional().trim().escape(),
    body('age').optional().isInt().withMessage('Age must be an integer').toInt(),
    body('cash_amount').notEmpty().withMessage('Cash amount is required').isFloat().withMessage('Cash amount must be a number').toFloat(),
    checkValidationErrors
], async (req, res) =>{
    const { first_name, last_name, age, cash_amount } = req.body

    try {
        await dbController.insertUser(first_name, last_name, age, cash_amount)
        res.status(201).json({ message: 'User created.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user.' })
    }
})

app.patch('/update',[
    query('user_id').isInt().withMessage('User ID must be an integer').toInt(),
    body('first_name').optional().trim().escape(),
    body('last_name').optional().trim().escape(),
    body('age').optional().isInt().withMessage('Age must be an integer').toInt(),
    body('cash_amount').optional().isFloat().withMessage('Cash amount must be a number').toFloat(),
    checkValidationErrors
], async (req, res) =>{
    const { first_name, last_name, age, cash_amount } = req.body
    const user_id = req.query.user_id

    try {
        await dbController.updateUser(user_id, first_name, last_name, age, cash_amount)
        res.json({ message: 'User info updated.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

app.delete('/delete', [
    param('id').isInt().withMessage('User ID must be an integer').toInt(),
    checkValidationErrors
], async (req, res) =>{
    try {
        await dbController.deleteUserById(req.query.user_id)
        res.json({ message: 'User deleted.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user.' })
    }
})

app.listen(process.env.DEFAULT_PORT, () => {
    console.log(`Server listening on port ${process.env.DEFAULT_PORT}`)
});

process.on('SIGINT', () => {
    dbController.closeDB()
});

