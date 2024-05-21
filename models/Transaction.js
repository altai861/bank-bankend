const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    moneyType: {
        type: String,
        required: true
    },
    transactionValue: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Transaction", transactionSchema);