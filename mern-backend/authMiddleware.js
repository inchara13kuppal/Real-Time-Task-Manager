const jwt = require('jsonwebtoken');

// Middleware function to check for a valid JWT token
module.exports = function (req, res, next) {
    // Get token from header (sent by React)
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload to the request object
        req.user = decoded.user;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};