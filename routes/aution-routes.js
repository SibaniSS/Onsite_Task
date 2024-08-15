const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authentication');
const auctionController = require('../controllers/aution');


router.post('/start', authenticateUser, auctionController.startAuction);


router.post('/end/:id', authenticateUser, auctionController.endAuction);

router.get('/:id', auctionController.getAuctionStatus);

module.exports = router;