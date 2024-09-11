const router = require('express').Router();

const { 
    register, 
    login, 
    refreshToken,
    logout,
} = require('../controller/auth.controller');
const { authentication } = require('../middleware/authMiddleware');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/refresh-token').get(refreshToken);
router.route('/logout').get(authentication, logout);


module.exports = router;