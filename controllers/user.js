const express = require('express')
const router = express.Router()

const { User } = require('../model/user')
const {authenticateUser } = require('../middlewares/authentication')

const { authorizationUser } = require('../middlewares/authorization')



router.post('/register', (req, res) => {
    const body = req.body
    const user = new User(body)

    user.save()
        .then((user) => {
            res.send({
                user,
                notice: "Succesfully Registerd"
            })
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/login', (req, res) => {
    const body = req.body

    User.findByEmailAndPassword(body.email, body.password)
        .then((user) => {
            return user.generateToken()

        })
        .then((token) => {
            res.send({ token })
        })
        .catch((err) => {
            res.status(404).send(err)
        })
})


router.get('/', authenticateUser, (req, res) => {
    User.find({ _id: req.user._id })
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.delete('/logout', authenticateUser, (req, res) => {
    const token = req.token
    const user = req.user
    const tokenData = user.tokens.filter(x => x.token != token)  
    user.tokens = tokenData
    user.save()
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = {
    usersRouter: router}