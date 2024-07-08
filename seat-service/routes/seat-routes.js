const express = require('express');
const router = express.Router();
const Controller = require("../controllers/seat-controller")
const isAdmin = require("../middleware/admin")
const tokenverfication = require("../authentication/token-verfy")
const Validation = require("../validations/validation")

router.post('/addSeatNumber', Validation.addseatnumbersValidation, tokenverfication, isAdmin, Controller.addseatNumberController);

module.exports = router;