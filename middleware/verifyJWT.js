const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: "Forbidden after decoding" })
            }
            req.userId = decoded.UserInfo.userId;
            next();
        }
    )
}

module.exports = verifyJWT;