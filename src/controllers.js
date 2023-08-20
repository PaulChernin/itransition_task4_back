import db from './queries.js'
import jwt from 'jsonwebtoken'
import hashPassword from './hashPassword.js'

const secretKey = process.env.SECRET_KEY

const setTokenCookie = (request, response) => {
    const token = jwt.sign(request.body.mail, secretKey)
    response.status(200).json({token: token})
}

const createUser = async (request) => {
    const {name, mail, password} = request.body
    const passwordHash = hashPassword(password)
    await db.createUser({name, mail, passwordHash})
}

const handleSignupError = (error, response) => {
    if (error.code = '23505') {
        response.status(409)
        response.send('This mail is already in use')
    } else {
        response.status(500)
    }
}

const signup = async (request, response) => {
    try {
        await createUser(request)
        setTokenCookie(request, response)
        response.status(200).end()
    } catch (e) {
        handleSignupError(e, response)
    }
}

const validateUser = async (request) => {
    const {mail, password} = request.body
    const passwordHash = hashPassword(password)
    const user = await db.getUserByMail(mail)
    return user && (user.passwordHash === passwordHash) && !user.isBlocked
}

const handleLoginError = (response) => {
    response.status(403)
    response.send('Invalid credentials. Your account is probably blocked or deleted')
}

const login = async (request, response) => {
    const isValid = await validateUser(request)
    if (isValid) {
        setTokenCookie(request, response)
        response.status(200).end()
    } else {
        handleLoginError(response)
    }
}

const getUsers = async (request, response) => {
    const users = await db.getUsers()
    response.status(200).json(users)
}

const setUsersStatus = async (request, response) => {
    const {userIds, isBlocked} = request.body
    await db.setUsersStatus(userIds, isBlocked)
    response.status(200).end()
}

const deleteUsers = async (request, response) => {
    const userIds = request.body
    await db.deleteUsers(userIds)
    response.status(200).end()
}

export default {
    signup,
    login,
    getUsers,
    setUsersStatus,
    deleteUsers
}