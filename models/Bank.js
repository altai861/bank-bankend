const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    bankName: {
        type: String,
        required: true
    },
    bankLogo: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Bank", bankSchema)