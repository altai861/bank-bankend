const express = require("express");
const router = express.Router();
const bankControllers = require("../controllers/bankControllers.js");
const verifyJWT = require("../middleware/verifyJWT.js")

router.use(verifyJWT)

router.route("/")
    .get(bankControllers.getBanks)
    .post(bankControllers.createBank)
    //.patch(bankControllers.updateBank)
    //.delete(bankControllers.deleteBank)

module.exports = router;