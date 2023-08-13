import { Router } from 'express'
import controllers from './controllers.js'

const router = new Router()

router.post('/signup', controllers.signup)
router.post('/login', controllers.login)
router.get('/users', controllers.getUsers)
router.post('/users-block', controllers.blockUsers)
router.post('/users-unblock', controllers.unblockUsers)
router.post('/users-delete', controllers.deleteUsers)

export default router