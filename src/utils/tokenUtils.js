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

    setTokenCookies = async (res, accessToken, refreshToken) => {
        const isProduction = process.env.NODE_ENV === 'production';
        const domain = isProduction ? 'localhost:3000' : undefined;

        res.cookie('accessToken', accessToken, { 
            httpOnly: true,
            secure: true,
            // domain: domain,
            path: '/',
            sameSite: 'None' // or 'Lax' depending on your requirement
        });

        res.cookie('refreshToken', refreshToken, { 
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            secure: true,
            path: '/',
            // domain: domain,
            sameSite: 'None' // or 'Lax' depending on your requirement
        });
    };


    removeTokenCookies = async (res, UserId) => {
        const isProduction = process.env.NODE_ENV === 'production';
        const domain = isProduction ? 'www.something.com' : undefined;
    
        const cookieOptions = { 
            path: '/', 
            // domain: domain, 
            secure: true, 
            httpOnly: true, 
            sameSite: 'None' // or 'Lax' depending on your requirement
        };

        await userModel.findByIdAndUpdate(UserId, {token: ""});
    
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
    };
}

module.exports = new TokenService();
