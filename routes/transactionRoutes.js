const express = require("express");
const router = express.Router();
const transactionControllers = require("../controllers/transactionControllers.js");
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT);

router.route("/")
    .get(transactionControllers.getMyTransactions)
    .post(transactionControllers.createNewTransaction)

module.exports = router;