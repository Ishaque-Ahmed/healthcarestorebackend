const _ = require('lodash');
//For File Handling npm install formidable
const formidable = require('formidable');
const fs = require('fs');

const { Prescription, validate } = require('../models/prescription');

module.exports.createPrescription = async (req, res) => {
    const userId = req.user._id;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {

        if (err) return res.status(400).send("Something Went Wrong!");

        const { error } = validate(_.pick(fields, ["price", "curStatus"]));

        if (error) return res.status(400).send(error.details[0].message);

        const prescription = new Prescription(fields);

        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send("Problem in file data!");
                prescription.photo.data = data;
                prescription.photo.contentType = files.photo.mimetype;

                prescription.save((err, result) => {
                    if (err) return res.status(500).send("Internal Server Error.");
                    else return res.status(201).send({
                        message: "Prescription Uploaded Successfully",
                        data: _.pick(result, ["_id", "photo", "curStatus", "price", "user"])
                    })
                })
            })
        } else {
            return res.status(400).send("No image Provided");
        }
    })
}
module.exports.getPrescriptions = async (req, res) => {

    let order = req.query.order === 'desc' ? -1 : 1;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const prescriptions = await Prescription.find()
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .limit(limit)
        .populate('user', '_id');
    return res.status(200).send(prescriptions);
}

module.exports.getPrescriptionByUserId = async (req, res) => {
    const userId = req.headers.userid;
    const prescriptions = await Prescription.find({ user: userId, curStatus: 'AdminApproved' });

    if (!prescriptions) return res.status(404).send("Not Found");

    return res.status(200).send(prescriptions);
}

module.exports.getPrescriptionPhoto = async (req, res) => {
    const prescriptionId = req.params.id;
    const prescription = await Prescription.findById(prescriptionId)
        .select({ photo: 1, _id: 0 });

    res.set('Content-Type', prescription.photo.contentType);
    return res.status(200).send(prescription.photo.data);
}

module.exports.updatePrescriptionByStatus = async (req, res) => {
    const presId = req.headers.prescriptionid;
    const prescription = await Prescription.findById(presId);

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something Wrong!");
        const updatedFields = _.pick(fields, ["curStatus"]);

        _.assignIn(prescription, updatedFields);
        prescription.save((err, result) => {
            if (err) return res.status(500).send("Something Wrong");
            else return res.status(200).send({
                message: "Status Updated Successfully",
            })
        })
    })
}
module.exports.deletePrescription = async (req, res) => {
    const presId = req.headers.prescriptionid;
    console.log(presId);
    try {
        const prescription = await Prescription.findByIdAndDelete(presId);
        if (!prescription) res.status(404).send("Prescription Id was not found!");
        res.send(prescription);
    } catch (err) {
        res.status(404).send("Prescription Id was not found!");
    }
}