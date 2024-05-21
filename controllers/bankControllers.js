const Bank = require("../models/Bank");

const getBanks = async (req, res) => {
    const banks = await Bank.find().lean();
    if (!banks?.length) {
        return res.status(400).json({ message: "No bank found" })
    }
    return res.json(banks);
}

const createBank = async (req, res) => {
    const { bankName, logoPath } = req.body;

    if (!bankName || !logoPath) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const duplicate = await Bank.findOne({ bankName }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate bank name" });
    }
    const bank = await Bank.create({
        bankName,
        bankLogo: logoPath
    })

    if (bank) {
        return res.status(201).json({ message: `New Bank ${bankName} created` })
    } else {
        return res.status(400).json({ message: "Invalid bank data received" });
    }
}


module.exports = {
    getBanks,
    createBank
}