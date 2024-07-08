const express = require('express');
const router = express.Router();
const Controller = require("../controllers/movie-controller")
const isAdmin = require("../middleware/admin")
const tokenverfication = require("../authentication/token-verfy")
const Validation = require("../validations/validation")


router.post('/addMovies', Validation.addMoviesValidation, tokenverfication, isAdmin, Controller.Movie);
router.post('/addMovieSlot', Validation.addMoviesSlotValidation, tokenverfication, isAdmin, Controller.MovieSlot);


router.get('/showMovies', Controller.ShowMovies);

router.get('/:id', Controller.getMovieByid);

module.exports = router