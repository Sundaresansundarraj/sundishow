const joi = require("joi")
const errHandler = require("../middleware/errorhandler")

class Validation {
  static async paymentValidation(req, res, next) {
    try {
      const schema = joi.object({
        amount: joi.number().required(),
        quantity: joi.number().required(),
        payment_method_types: joi.string().required(),
        booking_id: joi.number().required(),

        // amount: joi.number().required(),
        // payment_method: joi.string().required(),
        // currency: joi.string().required()

      });

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }
}
module.exports = Validation
