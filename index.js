require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3500;
const { logger } = require("./middleware/logger.js")
const connectDB = require("./config/dbConn.js");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions.js")

connectDB();

app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));

app.use("/", require("./routes/root.js"));

app.use("/auth", require("./routes/authRoutes.js"));
app.use("/bank", require("./routes/bankRoutes.js"));
app.use("/bankAccount", require("./routes/bankAccountRoutes.js"));
app.use("/transaction", require("./routes/transactionRoutes.js"));
app.use("/findUser", require("./routes/findUserRoutes.js"));

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ "error": '404 not found' })
    } else {
        res.type('txt').send("404 not found");
    }
})

mongoose.connection.once('open', ()=> {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server running on port ${port}`));
})