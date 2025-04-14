const jwt = require("jsonwebtoken");
const jwtSecret = "mynameisPriyankaParekhITVGECsem6$#";

// Middleware to verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

// Middleware to protect routes with JWT authentication
function protectRoute(req, res, next) {
    jwt.verify(req.token, jwtSecret, (err, authData) => {
        if (err) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            req.authData = authData;
            next();
        }
    });
}

module.exports = { verifyToken, protectRoute };
