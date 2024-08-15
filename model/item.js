const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    images: [{
        type: String, // URLs to images
    }],
    startingPrice: {
        type: Number,
        required: true,
    },
    auctionDuration: {
        type: Number, // Duration in hours or minutes
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = { Item };
