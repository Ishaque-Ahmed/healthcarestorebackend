const router = require('express').Router();
const { signIn, signUp, getUserbyUserId } = require('../controllers/userControllers');

const admin = require('../middlewares/admin');
const authorize = require('../middlewares/authorize');

router.route('/signup')
    .post(signUp);

router.route('/signin')
    .post(signIn);

router.route('/find')
    .get([authorize, admin], getUserbyUserId)

module.exports = router;