const BankAccount = require("../models/BankAccount");
const Transaction = require("../models/Transaction");
const USD = require("../middleware/findExchangeRate.js");

const getMyTransactions = async (req, res) => {
    try {
        const userId = req.userId;

        // Retrieve the user's bank accounts
        const bankAccounts = await BankAccount.find({ userId }).select('bankAccountNumber bankId');
        if (!bankAccounts || bankAccounts.length === 0) {
            return res.status(404).json({ message: "No bank accounts found for this user" });
        }

        const bankAccountMap = {};
        bankAccounts.forEach(account => {
            bankAccountMap[account.bankAccountNumber] = account.bankId;
        });
        const bankAccountNumbers = Object.keys(bankAccountMap);

        // Find transactions where the user's bank account is either the sender or the receiver
        const transactions = await Transaction.find({
            $or: [
                { senderId: { $in: bankAccountNumbers } },
                { receiverId: { $in: bankAccountNumbers } }
            ]
        }).sort({ date: -1 }); // Sort by date in descending order

        // Enhance transactions with bank IDs and transaction type
        const enhancedTransactions = await Promise.all(transactions.map(async (transaction) => {
            let userBankId, otherBankId, transactionType;

            if (bankAccountNumbers.includes(transaction.senderId)) {
                userBankId = bankAccountMap[transaction.senderId];
                transactionType = 'Зарлага';
                
                // Find the other person's bank ID
                const receiverAccount = await BankAccount.findOne({ bankAccountNumber: transaction.receiverId }).select('bankId');
                otherBankId = receiverAccount ? receiverAccount.bankId : null;
            } else if (bankAccountNumbers.includes(transaction.receiverId)) {
                userBankId = bankAccountMap[transaction.receiverId];
                transactionType = 'Орлого';
                
                // Find the other person's bank ID
                const senderAccount = await BankAccount.findOne({ bankAccountNumber: transaction.senderId }).select('bankId');
                otherBankId = senderAccount ? senderAccount.bankId : null;
            }

            return {
                ...transaction._doc,
                userBankId,
                otherBankId,
                transactionType
            };
        }));

        // Return the enhanced transactions as a response
        res.status(200).json(enhancedTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const createNewTransaction = async (req, res) => {
    //    //https://v6.exchangerate-api.com/v6/3e3ead4ce1f0ccb54406653e/latest/USD
    const exchangeRate = await USD();
    let realAmount;
    console.log(exchangeRate);
    const userId = req.userId;
    const { senderId, receiverId, amount, moneyType, transactionValue } = req.body;

    // Validate request body
    if (!senderId || !receiverId || !amount || !moneyType || !transactionValue) {
        return res.status(400).json({ message: "All fields are required" });
    }
    let parsedAmount = parseFloat(amount);
    try {
        // Check if the sender's bank account belongs to the authenticated user
        const senderAccount = await BankAccount.findOne({ bankAccountNumber: senderId, userId });
        if (!senderAccount) {
            return res.status(403).json({ message: "Unauthorized: Sender's bank account does not belong to the user" });
        }

        if (moneyType === "USD") {
            realAmount = amount * exchangeRate;
        } else if (moneyType === "MNT") {
            realAmount = amount;
        }

        // Check if the sender has sufficient balance
        if (senderAccount.balance < realAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Check if the receiver's bank account exists
        const receiverAccount = await BankAccount.findOne({ bankAccountNumber: receiverId });
        if (!receiverAccount) {
            return res.status(404).json({ message: "Receiver's bank account not found" });
        }

        // Create a new transaction
        const newTransaction = new Transaction({
            senderId,
            receiverId,
            amount,
            moneyType,
            transactionValue,
            date: new Date() // Set the current date
        });

        // Save the transaction to the database
        await newTransaction.save();

        // Update the balances of sender and receiver
        senderAccount.balance -= realAmount;
        receiverAccount.balance += realAmount;

        await senderAccount.save();
        await receiverAccount.save();

        // Return the created transaction
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getMyTransactions,
    createNewTransaction
}