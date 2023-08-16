import db from './queries.js'
import jwt from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY

const isAuthorized = async (request) => {
    const token = request.cookies.token
    if (!token) return false
    const mail = jwt.verify(token, secretKey)
    const user = await db.getUserByMail(mail)
    return user && !user.isBlocked
}

export const jwtMiddleware = async (request, response, next) => {
    if (!await isAuthorized(request)) {
        response.status(403).end()
        return
    }
    next()
}