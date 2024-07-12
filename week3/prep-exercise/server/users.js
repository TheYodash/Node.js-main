import newDatabase from './database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 12;
const SECRET_KEY = 'secretKey'


// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = false
const database = newDatabase({isPersistent})

// Create middlewares required for routes defined in app.js

// Register
export const register = async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const user = { username, password: hashedPassword }
  if (!isValidUser(user)) {
    res.status(400).json({ message: 'please provide username and password' });
    return
  }
  if (database.getById(user.username)) {
    res.status(400).json({ message: 'User already exists' });
    return
  }
  if (database.getByUsername(user.username)) {
    res.status(400).json({ message: 'User already exists' });
    return
  }

  const result = await database.create(user)
  res.json({ id: result.id, username: result.username });
}

// Login
export const login = async (req, res) => {
  const { username, password } = req.body
  const user = await database.getByUsername(username)
  if (!isValidUser(user)) {
    res.status(400).json({ message: 'please provide username and password' });
    return
  }
  if (!database.getByUsername(user.username)){
    res.status(400).json({ message: 'username does not exist' })
    return
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, SECRET_KEY)
    res.status(201).json({ token })
  } else {
    res.status(400).send('Incorrect password')
  }
}

// Get Profile
export const getProfile = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        res.status(401).json({ message: 'Unauthorized: invalid token' })
        return
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        const user = database.getById(decoded.id)
        console.log(user)
        if (!user) {
            res.status(401).json({ message: 'Unauthorized: invalid user' })
            return
        }
        res.json({ username: user.username })
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Unauthorized' })
    }
}



// logout
export const logout = async (req, res) => {
  res.status(204).json({ message: 'logout successful' });
}


// You can also create helper functions in this file to help you implement logic
// inside middlewares

const isValidUser = (user) => {
    if (!user || !user.username || !user.password) {
        return false
    }
    return true
}
