import db from './queries.js'
import jwt from 'jsonwebtoken'
import hashPassword from './hashPassword.js'

const secretKey = process.env.SECRET_KEY

const setTokenCookie = (request, response) => {
    const token = jwt.sign(request.body.mail, secretKey)
    response.cookie('token', token, {
        sameSite: 'none',
        secure: true
    })
}

const isUserExists = async (request) => {
    const existingUser = await db.getUserByMail(request.body.mail)
    return !!existingUser
}

const createUser = async (request) => {
    const {name, mail, password} = request.body
    const passwordHash = hashPassword(password)
    await db.createUser({name, mail, passwordHash})
}

const signup = async (request, response) => {
    if (await isUserExists(request)) {
        response.status(409).end()
        return
    }
    createUser(request)
    setTokenCookie(request, response)
    response.status(200).end()
}

const validateUser = async (request) => {
    const {mail, password} = request.body
    const passwordHash = hashPassword(password)
    const user = await db.getUserByMail(mail)
    return user && (user.passwordHash === passwordHash) && !user.isBlocked
}

const login = async (request, response) => {
    const isValid = await validateUser(request)
    if (isValid) {
        setTokenCookie(request, response)
        response.status(200).end()
    } else {
        response.status(403).end()
    }
}

const isAuthorized = async (request) => {
    const token = request.cookies.token
    if (!token) return false
    const mail = jwt.verify(token, secretKey)
    const user = await db.getUserByMail(mail)
    return user && !user.isBlocked
}

const getUsers = async (request, response) => {
    if (!await isAuthorized(request)) {
        response.status(403).end()
        return
    }
    const users = await db.getUsers()
    response.status(200).json(users)
}

const blockUsers = async (request, response) => {
    if (!await isAuthorized(request)) {
        response.status(403).end()
        return
    }
    const userIds = request.body
    await db.blockUsers(userIds)
    response.status(200).end()
}

const unblockUsers = async (request, response) => {
    if (!await isAuthorized(request)) {
        response.status(403).end()
        return
    }
    const userIds = request.body
    await db.unblockUsers(userIds)
    response.status(200).end()
}

const deleteUsers = async (request, response) => {
    if (!await isAuthorized(request)) {
        response.status(403).end()
        return
    }
    const userIds = request.body
    await db.deleteUsers(userIds)
    response.status(200).end()
}

export default {
    signup,
    login,
    getUsers,
    blockUsers,
    unblockUsers,
    deleteUsers
}