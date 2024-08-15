const mongoose = require('mongoose')
const { Schema } = mongoose
const { Bidding } = require('./bidding')

const sessionSchema = new Schema({

    product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    isAlloted: {
        type: Boolean,
        default: true
    }
})



sessionSchema.post('save', function (next) { // post will happen aafter session model is saved to db
    const self = this // document that is saved
    const data = {
        session: self._id, //id for newly save ddocument
        product: self.product // product field for the docment
    }
    const bidding = new Bidding(data)
    bidding.save()
        .then((res) => {
            next
        })
        .catch((err) => {
            console.log(err)
            next
        })

})

const Session = mongoose.model('Session', sessionSchema)

module.exports = {
    Session
}