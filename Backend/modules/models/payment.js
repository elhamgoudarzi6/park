const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PaymentSchema = new Schema({
    unitID: { type: mongoose.Schema.ObjectId, require, ref: 'Unit' },
    guarantors: [{ fullName: String, mobile: String, nationalCode: String }],
    approvedAmount: { type: String },
    amountPayable: { type: String },
    approvalType: { type: String },
    approvalSubType: { type: String },
    meetingDate: { type: String },
    finalDueDate: { type: String },
    meetingNumber: { type: String },
    info: { type: String },
    paymentDate: { type: String },
    paymentDateFirst: { type: String },
    paymentDateSecond: { type: String },
    InstallmentNumber: { type: Number },
    InstallmentRemainNumber: { type: Number },
    breathingTime: { type: Number },
    paymentPlace: { type: String },
    guaranteeType: { type: String },
    show: { type: Boolean, default: true },
}, { toJSON: { virtuals: true } });
PaymentSchema.virtual('Unit', {
    ref: 'Unit',
    localField: 'unitID',
    foreignField: '_id',
});
module.exports = mongoose.model('Payment', PaymentSchema);
