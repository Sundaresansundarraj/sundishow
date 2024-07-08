const express = require('express');
const router = express.Router();
const Controller = require("../controllers/booking-controller")
const tokenverfication = require("../authentication/token-verfy")
const Validation = require("../validations/validation")



router.post('/booking', Validation.movieBookingValidation,tokenverfication,Controller.Booking);
// router.get(/bookingdetailsbyid)


module.exports = router