
const BankAccount = require("../models/BankAccount");
const User = require("../models/User");

const findUser = async (req, res) => {
    try {
        const { bankId, accountNumber } = req.body;

        // Find the bank account with the given bankId and accountNumber
        const account = await BankAccount.findOne({ bankId, bankAccountNumber: accountNumber });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Find the user who owns the account
        const user = await User.findById(account.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user's name
        res.status(200).json({ userName: user.username });
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    findUser
}
