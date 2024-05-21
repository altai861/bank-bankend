const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankAccountSchema = new Schema({
    bankAccountNumber: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    bankId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 100000
    }
})

module.exports = mongoose.model("BankAccount", bankAccountSchema);