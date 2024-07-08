const joi = require("joi")
const errHandler = require("../middleware/errorhandler.js")

class Validation {
  
  static async addseatnumbersValidation(req, res, next) {
    try {
      const schema = joi.object({
        theater_id: joi.number().required(),
        screen_id: joi.number().required(),
      });
      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

}
module.exports = Validation
