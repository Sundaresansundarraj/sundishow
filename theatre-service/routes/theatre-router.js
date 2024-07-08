const express = require('express');
const router = express.Router();
const Controller = require("../controllers/theatre-controller")
const isAdmin = require("../middleware/admin")
const tokenverfication = require("../authentication/token-verfy")
const Validation = require("../validations/validation")


router.post('/addTheater', Validation.addTheaterValidation, tokenverfication, isAdmin, Controller.addtheater);
router.get('/findTheaterbylocation',  tokenverfication, Controller.getTheaterByLocation);
router.get('/findSpecficTheaterMovies', Validation.specficTheaterMovieValidation, tokenverfication, Controller.getSpecficTheaterMovies);

module.exports = router