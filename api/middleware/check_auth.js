const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const [type, token] = req.headers.authorization.split(" ");
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.checkAuthUserData = decoded;
        req.checkAuthToken = token;
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: 'Authentication Failed'
        });
    }
};