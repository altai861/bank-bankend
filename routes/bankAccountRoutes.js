const express = require("express");
const router = express.Router();
const bankAccountControllers = require("../controllers/bankAccountControllers.js");
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT);

router.route("/")
    .get(bankAccountControllers.getMyBankAccounts)
    .post(bankAccountControllers.createNewBankAccount)
    .delete(bankAccountControllers.deleteBankAccount)

module.exports = router;