const router = require('express').Router();
const { createPrescription, getPrescriptionPhoto, getPrescriptions, getPrescriptionByUserId, updatePrescriptionByStatus, deletePrescription, getOrderedPrescription } = require('../controllers/prescriptionController');

const authorize = require('../middlewares/authorize');
const admin = require('../middlewares/admin');

router.route('/')
    .post(authorize, createPrescription)
    .get([authorize, admin], getPrescriptions);

router.route('/userconfirmed')
    .get(authorize, getOrderedPrescription)

router.route('/delete')
    .delete([authorize, admin], deletePrescription);

router.route('/user/current')
    .get(authorize, getPrescriptionByUserId);

router.route('/photo/:id')
    .get(getPrescriptionPhoto);

router.route('/update')
    .put(authorize, updatePrescriptionByStatus)

module.exports = router;