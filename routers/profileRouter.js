const router = require('express').Router();
const {
    setProfile,
    getProfile,
    getProfileById,
    getOrders
} = require('../controllers/profileController');

const authorize = require('../middlewares/authorize');
const admin = require('../middlewares/admin');

router.route('/')
    .post(authorize, setProfile)
    .get(authorize, getProfile);

router.route('/user')
    .get([authorize, admin], getProfileById);


router.route('/orders')
    .get(authorize, getOrders);

module.exports = router;