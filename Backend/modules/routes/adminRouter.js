const express = require('express');
const router = express.Router();

// middlewares
const apiAuthAdmin = require('./middleware/apiAuthAdmin');
const { uploadImage } = require('./middleware/UploadMiddleware');
const { uploadFiles } = require('./middleware/UploadMiddleware');

//user Controllers
const { api: ControllerApi } = config.path.controllers;
//admin controller
const AuthController = require(`${ControllerApi}/admin/AuthController`);
const AdminUploadController = require(`${ControllerApi}/admin/UploadController`);
const UserController = require(`${ControllerApi}/admin/UserController`);
const UnitController = require(`${ControllerApi}/admin/UnitController`);
const PaymentController = require(`${ControllerApi}/admin/PaymentController`);

//upload
router.post('/upload', uploadImage.single('file'), AdminUploadController.uploadImage.bind(AdminUploadController));
//multi file
router.post('/multiUpload', uploadFiles, AdminUploadController.uploadFiles.bind(AdminUploadController));

//delete file uploaded in server
router.post('/deleteFile', AdminUploadController.deleteFile.bind(AdminUploadController));

//auth admin
router.post('/loginAdmin', AuthController.loginAdmin.bind(AuthController));
router.post('/registerAdmin', apiAuthAdmin, AuthController.registerAdmin.bind(AuthController));
router.put('/updateAdmin/:id', apiAuthAdmin, AuthController.updateAdmin.bind(AuthController));
router.delete('/deleteAdmin/:id', apiAuthAdmin, AuthController.deleteAdmin.bind(AuthController));
router.get('/getAllAdmin', apiAuthAdmin, AuthController.getAllAdmin.bind(AuthController));
router.get('/getAdmin/:id', apiAuthAdmin, AuthController.getAdmin.bind(AuthController));
router.put('/changePassword/:id', apiAuthAdmin, AuthController.changePassword.bind(AuthController));
router.put('/changeUsername/:id', apiAuthAdmin, AuthController.changeUsername.bind(AuthController));
router.put('/resetPassword', apiAuthAdmin, AuthController.resetPassword.bind(AuthController));
//token
router.post('/getToken/:id', AuthController.getToken.bind(AuthController));

//user
router.post('/registerUser', apiAuthAdmin, UserController.registerUser.bind(UserController));
router.put('/updateUser/:id', apiAuthAdmin, UserController.updateUser.bind(UserController));
router.delete('/deleteUser/:id', apiAuthAdmin, UserController.deleteUser.bind(UserController));
router.get('/getUser/:id', apiAuthAdmin, UserController.getUser.bind(UserController));
router.get('/getAllUser', apiAuthAdmin, UserController.getAllUser.bind(UserController));

//unit
router.post('/registerUnit', apiAuthAdmin, UnitController.registerUnit.bind(UnitController));
router.get('/getAllUnit', apiAuthAdmin, UnitController.getAllUnit.bind(UnitController));
router.get('/getUnit/:id', apiAuthAdmin, UnitController.getUnit.bind(UnitController));
router.put('/updateUnit/:id', apiAuthAdmin, UnitController.updateUnit.bind(UnitController));
router.delete('/deleteUnit/:id', apiAuthAdmin, UnitController.deleteUnit.bind(UnitController));
router.post('/advanceSearchUnit', apiAuthAdmin, UnitController.advanceSearchUnit.bind(UnitController));
router.post('/test', apiAuthAdmin, UnitController.test.bind(UnitController));
router.get('/getAllUnitTrash', apiAuthAdmin, UnitController.getAllUnitTrash.bind(UnitController));
router.get('/getAllUnitExit', apiAuthAdmin, UnitController.getAllUnitExit.bind(UnitController));

//Payment
router.post('/registerPayment', apiAuthAdmin, PaymentController.registerPayment.bind(PaymentController));
router.get('/getAllPayment', apiAuthAdmin, PaymentController.getAllPayment.bind(PaymentController));
router.get('/getPayment/:id', apiAuthAdmin, PaymentController.getPayment.bind(PaymentController));
router.put('/updatePayment/:id', apiAuthAdmin, PaymentController.updatePayment.bind(PaymentController));
router.delete('/deletePayment/:id', apiAuthAdmin, PaymentController.deletePayment.bind(PaymentController));
router.post('/advanceSearchPayment', apiAuthAdmin, PaymentController.advanceSearchPayment.bind(PaymentController));
router.get('/getAllPaymentTrash', apiAuthAdmin, PaymentController.getAllPaymentTrash.bind(PaymentController));

module.exports = router;
