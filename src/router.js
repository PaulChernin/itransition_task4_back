import { Router } from 'express'
import controllers from './controllers.js'

const router = new Router()

router.post('/signup', controllers.signup)
router.post('/login', controllers.login)
router.get('/protected/users', controllers.getUsers)
router.post('/protected/users-block', controllers.blockUsers)
router.post('/protected/users-unblock', controllers.unblockUsers)
router.post('/protected/users-delete', controllers.deleteUsers)



export default router