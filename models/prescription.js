const { Schema, model } = require('mongoose');
const joi = require('joi');

const PrescriptionSchema = Schema({
    photo: {
        data: Buffer,
        contentType: String,
    },
    price: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    curStatus: {
        type: String,
        enum: ['Pending', 'AdminApproved', 'UserConfirmed', 'UserCancelled'],
        default: 'Pending'
    }
}, { timestamps: true })

module.exports.Prescription = model("Prescription", PrescriptionSchema);

module.exports.validate = Prescription => {
    const schema = joi.object({
        price: joi.number(),
        curStatus: joi.string()
    })
    return schema.validate(Prescription);
}