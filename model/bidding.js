const mongoose = require('mongoose');
const { Schema } = mongoose;

const participantSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    }
});

const biddingSchema = new Schema({
    auction: {
        type: Schema.Types.ObjectId,
        ref: 'Auction',
    },
    participants: [participantSchema],
    highestBid: {
        type: Number,
        default: 0
    },
    highestBidder: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

const Bidding = mongoose.model('Bidding', biddingSchema);

module.exports = { Bidding };
