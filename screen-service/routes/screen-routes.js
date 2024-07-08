const express = require('express');
const router = express.Router();
const Controller = require("../controllers/screen-controller")
const isAdmin = require("../middleware/admin")
const tokenverfication = require("../authentication/token-verfy")
const Validation = require("../validations/validation")

router.post('/addTheaterScreen', Validation.addTheaterScreenValidation, tokenverfication, isAdmin, Controller.addtheaterScreenController);

module.exports = router;