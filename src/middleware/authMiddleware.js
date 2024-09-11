const TokenUtils = require("../utils/tokenUtils");
const ResponseUtils = require("../utils/responseUtils");

const authentication = async (req, res, next) => {
    const token = req.cookies.accessToken || req.header('Authorization')?.split(' ')[1] ;

    
    if (!token) {
        return ResponseUtils.unauthorizedResponse(res, "Unauthenticated" );
    }

    try {
        const user = TokenUtils.verifyAccessToken(token);
        req.user = user;
        next();
    } catch (err) {
        ResponseUtils.unauthorizedResponse(res, err.message);
    }
}

module.exports = {authentication};