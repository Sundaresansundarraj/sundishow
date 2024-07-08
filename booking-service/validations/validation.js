const joi = require("joi")
const errHandler = require("../middleware/errorhandler.js")

class Validation {
  
  static async movieBookingValidation(req, res, next) {
    try {
      const schema = joi.object({
        movie_id: joi.number().required(),
        movie_slot_id: joi.number().required(),
        theater_id: joi.number().required(),
        screen_id: joi.number().required(),
        ticket_count: joi.number().required(),
        seat_id: joi.array().items(joi.number()).min(1).required(),

      });

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }


}
module.exports = Validation
