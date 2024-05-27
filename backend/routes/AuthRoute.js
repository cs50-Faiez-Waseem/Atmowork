const router = require('express').Router()
const AuthController  = require('../controllers/AuthController')

router.post('/register' , AuthController.register)
router.post('/signin' , AuthController.login)
router.post('/stripe-pay' , AuthController.pay)
router.post('/logout' , AuthController.logOut)

module.exports = router