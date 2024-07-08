const joi = require("joi")
const errHandler = require("../middleware/errorhandler.js")

class Validation {
  
  static   async addTheaterScreenValidation(req, res, next) {
    try {
      const schema = joi.object({
        screen_name: joi.string().required(),
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
