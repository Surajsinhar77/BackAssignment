const { 
    userProfileUpdate,
    getProfile,
} = require('../controller/auth.controller');

const router = require('express').Router();
const { authentication } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/fileUploaderMiddleware');


router.use(authentication);

router.route('/profile/:usedId').get(getProfile);
router.route('/profile').put(upload, userProfileUpdate);


module.exports = router;