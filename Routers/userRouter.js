const express = require('express')
const router = express.Router()
const authController = require('../Controllers/authController')
const userController = require('../Controllers/userController')


router.post('/singup',authController.singup)
router.post('/login',authController.login)
router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:resetToken',authController.resetPassword)

// all are protectted router
router.use(authController.protected)

router.patch('/updatePassword',authController.updatePassword)
router.get('/me',userController.getMe)
router.patch('/updateMe',userController.me,userController.updateData)

router.use(authController.resticTo('admin'))
router.route('/',)
.get(userController.getAllUsers)


router.route('/:id')
.get(userController.getUser)
.patch(userController.updateData)
.delete(userController.deleteUser)

module.exports = router