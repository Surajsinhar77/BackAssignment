const jwt = require('jsonwebtoken')
const userModel = require("../model/user.model");
require('dotenv').config;

class TokenService{
    accessTokenSecret
    refreshTokenSecret

    payload = {
        _id: '_id',
        username: 'username',
        email: 'email',
    }

    constructor() {
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY
    }

    generateAuthToken(payload){
        this.payload._id = payload._id;
        this.payload.username = payload.username;
        this.payload.email = payload.email;
        
        const accessToken = jwt.sign(this.payload, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn : '24h' });
        const refreshToken = jwt.sign(this.payload, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '7d'});

        return {accessToken, refreshToken};
    }

    verifyAccessToken(token){
        try {
            return jwt.verify(token, this.accessTokenSecret);
            
        } catch (err) {
            throw err; // Re-throw the error for the caller to handle
        }
    }

    verifyRefreshToken(token){
        try{
            return jwt.verify(token, this.refreshTokenSecret);
        }catch(err){
            throw err;
        }
    }


    async findAndRefreshToken(UserId, token){
        try{
            return await userModel.findByIdAndUpdate(UserId, {token: token}, {new: true});
        }catch(err){
            throw err;
        }
    }

    async setTokenCookies(res, accessToken, refreshToken) {
        const isProduction = process.env.NODE_ENV === 'production';
        const domain = isProduction ? '.yourdomain.com' : undefined; // Use your domain in production
        const secureFlag = isProduction; // Secure only in production (HTTPS)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: secureFlag, // Only secure in production (HTTPS)
            domain: domain, // Set domain for cross-domain cookies
            path: '/',
            sameSite: 'None', // Allow cross-site cookies
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            secure: secureFlag,
            domain: domain,
            path: '/',
            sameSite: 'None',
        });
    }

    async removeTokenCookies(res, UserId) {
        const isProduction = process.env.NODE_ENV === 'production';
        const domain = isProduction ? '.yourdomain.com' : undefined; // Use your domain in production

        const cookieOptions = {
            path: '/',
            domain: domain,
            secure: isProduction,
            httpOnly: true,
            sameSite: 'None', // Allow cross-site cookies
        };

        await userModel.findByIdAndUpdate(UserId, { token: "" });

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
    }

}

module.exports = new TokenService();
