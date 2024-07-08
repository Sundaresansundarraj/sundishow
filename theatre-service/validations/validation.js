const joi = require("joi")
const errHandler = require("../middleware/errorhandler")

class Validation {
  
  static async addTheaterValidation(req, res, next) {
    try {
      const schema = joi.object({
        theater_name: joi.string().required(),
        location: joi.string().required(),
      });
      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

  static async FindTheaterbyLocationValidation(req, res, next) {
    try {
      const schema = joi.object({
        location: joi.string().required(),
      });
      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

  static async specficTheaterMovieValidation(req, res, next) {
    try {
      const schema = joi.object({
        theater_id: joi.number().required(),
      });
      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

}
module.exports = Validation
