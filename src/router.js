import { Router } from 'express'
import controllers from './controllers.js'

const router = new Router()

router.post('/signup', controllers.signup)
router.post('/login', controllers.login)
router.get('/protected/users', controllers.getUsers)
router.post('/protected/users-status', controllers.setUsersStatus)
router.post('/protected/users-delete', controllers.deleteUsers)

export default router