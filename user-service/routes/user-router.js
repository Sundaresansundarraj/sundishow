const express = require('express');
const router = express.Router();
const Controller = require("../controllers/user-controller")
const isAdmin = require("../middleware/admin")
const tokenverfication = require("../authentication/token-verfy")
const Validation = require("../validations/validation")


router.post('/register', Validation.registerValidation, Controller.signup);
router.post('/login', Validation.loginValidation, Controller.login);
router.get('/getallusers', tokenverfication, isAdmin, Controller.getAllUser);
router.get('/getspecficUser', tokenverfication, Controller.getSpecficUser);
router.put('/UpdateProfile', tokenverfication, Validation.updateProfileValidation, Controller.updateUser);
router.post('/forgetPassword', Validation.forgetPasswordValidation, Controller.forgetPassword);
router.post("/sentotp",tokenverfication,Controller.generateAndSendOTP)
router.post("/verifypassword",tokenverfication,Controller.verifypassword)
router.put('/resetPassword/:id', Validation.resetPasswordValidation, Controller.resetPassword);

module.exports = router;