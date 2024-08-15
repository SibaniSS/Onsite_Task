const { Auction } = require('../model/Auction');
const { authenticateUser } = require('../middlewares/authentication');

// Start Auction
exports.startAuction = async (req, res) => {
    const { productId, startTime, endTime } = req.body;

    try {
        const auction = new Auction({
            product: productId,
            startTime,
            endTime,
            status: 'active'
        });
        await auction.save();

        res.send({ message: 'Auction started successfully', auction });
    } catch (err) {
        res.status(500).send(err);
    }
};

// End Auction
exports.endAuction = async (req, res) => {
    const auctionId = req.params.id;

    try {
        const auction = await Auction.findById(auctionId);

        if (!auction) {
            return res.status(404).send('Auction not found');
        }

        if (auction.status === 'ended') {
            return res.status(400).send('Auction already ended');
        }

        auction.status = 'ended';
        await auction.save();

        res.send({ message: 'Auction ended successfully', auction });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Get Auction Status
exports.getAuctionStatus = async (req, res) => {
    const auctionId = req.params.id;

    try {
        const auction = await Auction.findById(auctionId).populate('product');
        if (!auction) {
            return res.status(404).send('Auction not found');
        }
        res.send(auction);
    } catch (err) {
        res.status(500).send(err);
    }
};
