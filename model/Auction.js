const mongoose = require('mongoose');
const { Schema } = mongoose;

const auctionSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'ended'],
        default: 'upcoming'
    }
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = { Auction };