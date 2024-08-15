const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middlewares/authentication')
const { Bidding } = require('../model/bidding')

router.get('/session/:id', (req, res) => {
    const id = req.params.id
    Bidding.findOne({ session: id }).populate('participant.user', 'name').populate('product')
        .then((response) => {
            res.send(response)
        })
        .catch((err)=> {
            res.send(err)
        })
})

router.get('/', authenticateUser, (req, res) => {
    Bidding.find().populate({
        path: "product",
        populate: {
            path: 'sold.user',

        }
    }).populate('participant.user').populate('session')
        .then((data) => {
            console.log(data)
            res.send(data)
        })
        .catch((err) => {
            res.send(data)
        })
})
router.put('/session/:id', authenticateUser, (req, res) => {
    const id = req.params.id
    const body = req.body
    Bidding.findOneAndUpdate({ session: id }, { $set: body }, { new: true }).populate('participant.user', 'name').populate('product')
        .then((bids) => {
            io.sockets.in(id).emit('updateBid', bids.participant);
            res.send(bids)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/user', authenticateUser, (req, res) => {
    const id = req.user._id
    Bidding.find({ 'participant.user': id }).populate('session').populate('participant.user').populate('product')
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = {
    biddingRouter: router
}