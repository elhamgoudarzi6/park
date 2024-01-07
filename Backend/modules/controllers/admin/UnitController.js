const Controller = require(`${config.path.controller}/Controller`);
objectId = require('mongoose').Types.ObjectId;

module.exports = new class UnitController extends Controller {
    test(req, res) {
        let match = []
        if (req.body.id) {
            match.push({ _id: objectId(req.body.id) });
        }
        if (req.body.meetingNumber) {
            match.push({ meetingNumber: req.body.meetingNumber });
        }
        // if (req.body.guarantors) {
        //     match.push({ guarantors: { $elemMatch: { fullName: req.body.guarantors } } });
        // }
        this.model.Unit.aggregate(
            [
                {
                    $lookup: {
                        from: "payments",
                        localField: "_id",
                        foreignField: "unitID",
                        as: "pay"
                    }
                },
                {
                    $unwind: { path: "$pay" }
                },
                {
                    $project:{
                        
                            guarantors: { $elemMatch: { fullName: req.body.guarantors } } 
                         
                    }
                },
                {
                    $project: {
                        guarantors: {
                           $filter: {
                            input: "$guarantors",
                            as: "item",
                            cond: {$eq: ["$$item.a", 1]}
                           }
                        }
                    }
                },
                // {
                //     $project: {
                //         "units" : "$$ROOT",
                //         meetingNumber: "$pay.meetingNumber",
                // InstallmentNumber: "$pay.InstallmentNumber",
                // paymentDate: "$pay.paymentDate",
                // document: "$$ROOT",
                // unitType:1,
                // ceoFullName:1,
                // ceoMobile:1,
                // ceoPhone:1,
                // ceoID:1,
                // members:1,
                // team:1,
                // idea: 1,
                // companyID:1,
                // companyName:1,
                // companyType:1,
                // admissionDate:1,
                // admissionNum:1,
                // unitStatus: 1,
                // outDate:1,
                // outNum: 1,
                // unitLocation: 1,
                // address:1,
                // logo:1,
                // workshopCode:1,
                // exit: 1,
                // show: 1,
                //     }
                // },
                {
                    $match: {
                        $and: match
                    }
                },
            ])
            .exec((err, Result) => {
                if (err) throw err;
                if (Result) {
                    console.log("end", match);
                    return res.json({
                        data: Result,
                        success: true
                    });
                }
                res.json({
                    data: 'اطلاعاتی وجود ندارد',
                    success: false
                })
            })
    }

    advanceSearchUnit(req, res) {
        let query = {};
        let sort = '';
        let select = req.body.select;
        if (req.body.companyID) {
            query.companyID = req.body.companyID;
        }
        if (req.body.ceoID) {
            query.ceoID = req.body.ceoID;
        }
        if (req.body.ceoPhone) {
            query.ceoPhone = req.body.ceoPhone;
        }
        if (req.body.ceoFullName) {
            query.ceoFullName = req.body.ceoFullName;
        }
        if (req.body.companyName) {
            query.companyName = req.body.companyName;
        }
        if (req.body.unitType) {
            query.unitType = req.body.unitType;
        }
        if (req.body.admissionDateMin && req.body.admissionDateMax) {
            query.admissionDate = { $gte: req.body.admissionDateMin, $lte: req.body.admissionDateMax };
        }
        if (req.body.members) {
            query.members = { $elemMatch: { fullName: { $in: req.body.members } } };
        }
        if (req.body.updatedAt) {
            sort = { updatedAt: req.body.updatedAt };
        }
        this.model.Unit.find(query).select(select).sort(sort)
            .exec((err, result) => {
                if (err) throw err;
                if (result) {
                    return res.json({
                        data: result,
                        success: true
                    });
                }
            });
    }

    getAllUnit(req, res) {
        this.model.Unit.find({ show: true, exit: false }).exec((err, Result) => {
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

    getAllUnitTrash(req, res) {
        this.model.Unit.find({ show: false }).exec((err, Result) => {
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

    getAllUnitExit(req, res) {
        this.model.Unit.find({ show: true, exit: true }).exec((err, Result) => {
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

    getUnit(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Unit.findById(req.params.id, (err, Result) => {
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

    registerUnit(req, res) {
        if (this.showValidationErrors(req, res))
            return;
        let newUnit = new this.model.Unit({
            unitType: req.body.unitType,
            companyName: req.body.companyName,
            ceoFullName: req.body.ceoFullName,
            ceoMobile: req.body.ceoMobile,
            ceoPhone: req.body.ceoPhone,
            ceoID: req.body.ceoID,
            members: req.body.members,
            idea: req.body.idea,
            companyID: req.body.companyID,
            admissionDate: req.body.admissionDate,
            team: req.body.team,
            admissionNum: req.body.admissionNum,
            unitStatus: req.body.unitStatus,
            outDate: req.body.outDate,
            outNum: req.body.outNum,
            unitLocation: req.body.unitLocation,
            address: req.body.address,
            companyType: req.body.companyType,
            workshopCode: req.body.workshopCode,
            logo: req.body.logo,
            exit: req.body.exit,
        })
        newUnit.save(err => {
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


    updateUnit(req, res) {
        let listFields = {};
        if (req.body.show) { listFields.show = req.body.show }
        if (req.body.exit) { listFields.exit = req.body.exit }
        if (req.body.companyType) { listFields.companyType = req.body.companyType }
        if (req.body.workshopCode) { listFields.workshopCode = req.body.workshopCode }
        if (req.body.unitType) { listFields.unitType = req.body.unitType }
        if (req.body.companyName) { listFields.companyName = req.body.companyName }
        if (req.body.ceoFullName) { listFields.ceoFullName = req.body.ceoFullName }
        if (req.body.ceoMobile) { listFields.ceoMobile = req.body.ceoMobile }
        if (req.body.ceoPhone) { listFields.ceoPhone = req.body.ceoPhone }
        if (req.body.ceoID) { listFields.ceoID = req.body.ceoID }
        if (req.body.members) { listFields.members = req.body.members }
        if (req.body.idea) { listFields.idea = req.body.idea }
        if (req.body.companyID) { listFields.companyID = req.body.companyID }
        if (req.body.admissionDate) { listFields.admissionDate = req.body.admissionDate }
        if (req.body.team) { listFields.team = req.body.team }
        if (req.body.admissionNum) { listFields.admissionNum = req.body.admissionNum }
        if (req.body.unitStatus) { listFields.unitStatus = req.body.unitStatus }
        if (req.body.outDate) { listFields.outDate = req.body.outDate }
        if (req.body.outNum) { listFields.outNum = req.body.outNum }
        if (req.body.unitLocation) { listFields.unitLocation = req.body.unitLocation }
        if (req.body.address) { listFields.address = req.body.address }
        if (req.body.logo) { listFields.logo = req.body.logo }
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Unit.findByIdAndUpdate(req.params.id, listFields, (err, Result) => {
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



    deleteUnit(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Unit.findByIdAndRemove(req.params.id, (err, Result) => {
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




                // {
                //     $match: {
                //         $and: [{ meetingNumber: req.body.meetingNumber }, { _id: objectId(req.body.id) }]
                //     }
                // },
                // { $match: { _id: objectId(req.body.id),meetingNumber:req.body.meetingNumber } },