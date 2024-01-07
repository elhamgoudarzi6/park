const Controller = require(`${config.path.controller}/Controller`);
objectId = require('mongoose').Types.ObjectId;

module.exports = new class PaymentController extends Controller {

    //     this.model.Payment.find({ unitID: req.params.id }).populate({
    //     path: "Unit",
    //     match: { _id: objectId(req.params.id) }
    // })
 advanceSearchPayment(req, res) {
        let query = {};
        let sort = '';
        let select = req.body.select;
        if (req.body.InstallmentNumber) {
            query.InstallmentNumber = req.body.InstallmentNumber;
        }
        if (req.body.breathingTime) {
            query.breathingTime = req.body.breathingTime;
        }
        if (req.body.amountPayable) {
            query.amountPayable = req.body.amountPayable;
        }
        if (req.body.guarantors) {
            query.guarantors = { $elemMatch: { fullName: req.body.guarantors } };
        }
        if (req.body.approvalType) {
            query.approvalType = req.body.approvalType;
        }
        if (req.body.approvalSubType) {
            query.approvalSubType = req.body.approvalSubType;
        }
        if (req.body.paymentPlace) {
            query.paymentPlace = req.body.paymentPlace;
        }
        if (req.body.meetingNumber) {
            query.meetingNumber = req.body.meetingNumber;
        }
        if (req.body.meetingDate) {
            query.meetingDate = req.body.meetingDate;
        }
        if (req.body.paymentDateMin && req.body.paymentDateMax) {
            query.paymentDate = { $gte: req.body.paymentDateMin, $lte: req.body.paymentDateMax };
        }
        if (req.body.updatedAt) {
            sort = { updatedAt: req.body.updatedAt };
        }
        this.model.Payment.find(query).select(select).sort(sort).populate('Unit')
            .exec((err, result) => {
                if (err) throw err;
                if (result) {
                    let payments = [];
                    let obj = {};
                    for (let i in result) {
                        obj = result[i];
                        obj.unitType = result[i].Unit[0].unitType;
                        obj.ceoFullName = result[i].Unit[0].ceoFullName;
                        payments.push(obj);
                    }
                    if (req.body.unitType) {
                        payments = payments.filter((item) => item.unitType == req.body.unitType);
                    }
                    if (req.body.unitID) {
                        payments = payments.filter((item) => item.unitID == req.body.unitID);
                    }
                    if (req.body.ceoFullName) {
                        payments = payments.filter((item) => item.ceoFullName == req.body.ceoFullName);
                    }
                    return res.json({
                        data: payments,
                        success: true
                    });
                }
            });


    }

    // advanceSearchPayment(req, res) {
    //     let query = {};
    //     let sort = '';
    //     let match = {}
    //     let select = req.body.select;
    //     if (req.body.unitID) {
    //         match = { _id: req.body.unitID };
    //         query.unitID = req.body.unitID;
    //     }
    //     if (req.body.unitType) {
    //         match = { unitType: req.body.unitType };
    //         let docs = [];
    //         const r = this.model.Unit.find({ unitType: req.body.unitType }, { _id: 1 });
    //         console.log(JSON.parse(r));
    //         // docs.push(r);
    //         // console.log(docs)
    //         // query.unitID = { $in: r }
    //         // console.log(query)
    //     }
    //     if (req.body.InstallmentNumber) {
    //         query.InstallmentNumber = req.body.InstallmentNumber;
    //     }
    //     if (req.body.breathingTime) {
    //         query.breathingTime = req.body.breathingTime;
    //     }
    //     if (req.body.amountPayable) {
    //         query.amountPayable = req.body.amountPayable;
    //     }
    //     if (req.body.guarantors) {
    //         query.guarantors = { $elemMatch: { fullName: req.body.guarantors } };
    //     }
    //     if (req.body.approvalType) {
    //         query.approvalType = req.body.approvalType;
    //     }
    //     if (req.body.approvalSubType) {
    //         query.approvalSubType = req.body.approvalSubType;
    //     }
    //     if (req.body.paymentPlace) {
    //         query.paymentPlace = req.body.paymentPlace;
    //     }
    //     if (req.body.meetingNumber) {
    //         query.meetingNumber = req.body.meetingNumber;
    //     }
    //     if (req.body.meetingDate) {
    //         query.meetingDate = req.body.meetingDate;
    //     }
    //     if (req.body.paymentDateMin && req.body.paymentDateMax) {
    //         query.paymentDate = { $gte: req.body.paymentDateMin, $lte: req.body.paymentDateMax };
    //     }
    //     if (req.body.updatedAt) {
    //         sort = { updatedAt: req.body.updatedAt };
    //     }
    //     this.model.Payment.find(query).select(select).sort(sort).populate({ path: "Unit", match: match })
    //         .exec((err, result) => {
    //             if (err) throw err;
    //             if (result) {
    //                 let payments = [];
    //                 let obj = {};
    //                 for (let i in result) {
    //                     obj = result[i];
    //                     obj.unitType = result[i].Unit[0].unitType;
    //                     obj.ceoFullName = result[i].Unit[0].ceoFullName;
    //                     payments.push(obj);
    //                 }
    //                 if (req.body.unitType) {
    //                     payments = payments.filter((item) => item.unitType == req.body.unitType);
    //                 }
    //                 if (req.body.unitID) {
    //                     payments = payments.filter((item) => item.unitID == req.body.unitID);
    //                 }
    //                 if (req.body.ceoFullName) {
    //                     payments = payments.filter((item) => item.ceoFullName == req.body.ceoFullName);
    //                 }
    //                 return res.json({
    //                     data: payments,
    //                     success: true
    //                 });
    //             }
    //         });

    // }


    getAllPayment(req, res) {
        this.model.Payment.find({ show: true }).populate('Unit').exec((err, Result) => {
            if (err) throw err;
            if (Result) {
                return res.json({
                    data: Result,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }


    getAllPaymentTrash(req, res) {
        this.model.Payment.find({ show: false }).populate('Unit').exec((err, Result) => {
            if (err) throw err;
            if (Result) {
                return res.json({
                    data: Result,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }

    getPayment(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Payment.findById(req.params.id, (err, Result) => {
            if (Result) {
                return res.json({
                    data: Result,
                    success: true
                })
            }
            res.json({
                data: 'یافت نشد',
                success: false
            })
        })
    }

    registerPayment(req, res) {
        if (this.showValidationErrors(req, res))
            return;
        let newPayment = new this.model.Payment({
            unitID: req.body.unitID,
            guarantors: req.body.guarantors,
            finalDueDate: req.body.finalDueDate,
            info: req.body.info,
            approvedAmount: req.body.approvedAmount,
            amountPayable: req.body.amountPayable,
            approvalType: req.body.approvalType,
            approvalSubType: req.body.approvalSubType,
            meetingDate: req.body.meetingDate,
            meetingNumber: req.body.meetingNumber,
            paymentDate: req.body.paymentDate,
            paymentDateFirst: req.body.paymentDateFirst,
            paymentDateSecond: req.body.paymentDateSecond,
            InstallmentNumber: req.body.InstallmentNumber,
            InstallmentRemainNumber: req.body.InstallmentRemainNumber,
            breathingTime: req.body.breathingTime,
            paymentPlace: req.body.paymentPlace,
            guaranteeType: req.body.guaranteeType,
        })
        newPayment.save(err => {
            if (err) return res.json({
                data: 'خطا',
                success: false
            });
            return res.json({
                data: 'با موفقیت ثبت شد',
                success: true
            });
        })
    }


    updatePayment(req, res) {
        let listFields = {};
        if (req.body.show) { listFields.show = req.body.show }
        if (req.body.info) { listFields.info = req.body.info }
        if (req.body.guaranteeType) { listFields.guaranteeType = req.body.guaranteeType }
        if (req.body.finalDueDate) { listFields.finalDueDate = req.body.finalDueDate }
        if (req.body.unitID) { listFields.unitID = req.body.unitID }
        if (req.body.guarantors) { listFields.guarantors = req.body.guarantors }
        if (req.body.approvedAmount) { listFields.approvedAmount = req.body.approvedAmount }
        if (req.body.amountPayable) { listFields.amountPayable = req.body.amountPayable }
        if (req.body.approvalType) { listFields.ceoPhone = req.body.approvalType }
        if (req.body.approvalSubType) { listFields.approvalSubType = req.body.approvalSubType }
        if (req.body.meetingDate) { listFields.meetingDate = req.body.meetingDate }
        if (req.body.meetingNumber) { listFields.meetingNumber = req.body.meetingNumber }
        if (req.body.paymentDate) { listFields.paymentDate = req.body.paymentDate }
        if (req.body.paymentDateFirst) { listFields.paymentDateFirst = req.body.paymentDateFirst }
        if (req.body.paymentDateSecond) { listFields.paymentDateSecond = req.body.paymentDateSecond }
        if (req.body.breathingTime) { listFields.breathingTime = req.body.breathingTime }
        if (req.body.InstallmentNumber) { listFields.InstallmentNumber = req.body.InstallmentNumber }
        if (req.body.InstallmentRemainNumber) { listFields.InstallmentRemainNumber = req.body.InstallmentRemainNumber }
        if (req.body.paymentPlace) { listFields.paymentPlace = req.body.paymentPlace }
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Payment.findByIdAndUpdate(req.params.id, listFields, (err, Result) => {
            if (err) throw err;
            if (Result) {
                return res.json({
                    data: 'با موفقیت بروز رسانی شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'چنین اطلاعاتی وجود ندارد',
                success: false
            });

        });
    }


    deletePayment(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Payment.findByIdAndRemove(req.params.id, (err, Result) => {
            if (err) throw err;
            if (Result) {
                return res.json({
                    data: 'با موفقیت حذف شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'چنین اطلاعاتی وجود ندارد',
                success: false
            });
        });
    }


}
