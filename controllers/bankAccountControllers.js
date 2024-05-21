const Bank = require("../models/Bank");
const BankAccount = require("../models/BankAccount");


const getMyBankAccounts = async (req, res) => {
    try {
        const userId = req.userId;

        const bankAccounts = await BankAccount.find({ userId });

        if (!bankAccounts || bankAccounts.length === 0) {
            return res.status(404).json({ message: "No bank accounts found for this user" });
        }

        res.status(200).json(bankAccounts);
    } catch (error) {
        console.error("Error fetching bank accounts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const createNewBankAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const { bankAccountNumber, bankId } = req.body;

        // Validation
        if (!bankAccountNumber || !bankId) {
            return res.status(400).json({ message: "Bank account number and bank ID are required" });
        }

        // Check for duplicate bank account number
        const existingAccount = await BankAccount.findOne({ bankAccountNumber });
        if (existingAccount) {
            return res.status(400).json({ message: "Bank account number already exists" });
        }

        // Create and save the new bank account
        const newBankAccount = new BankAccount({
            bankAccountNumber,
            userId,
            bankId,
            balance: 100000 // Default balance
        });

        await newBankAccount.save();
        res.status(201).json(newBankAccount);
    } catch (error) {
        console.error("Error creating bank account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const deleteBankAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const { bankAccountNumber } = req.body;

        // Basic validation
        if (!bankAccountNumber) {
            return res.status(400).json({ message: "Bank account number is required" });
        }

        const bankAccount = await BankAccount.findOneAndDelete({ userId, bankAccountNumber });

        if (!bankAccount) {
            return res.status(404).json({ message: "Bank account not found" });
        }

        res.status(200).json({ message: "Bank account deleted successfully" });
    } catch (error) {
        console.error("Error deleting bank account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    getMyBankAccounts,
    createNewBankAccount,
    deleteBankAccount
}