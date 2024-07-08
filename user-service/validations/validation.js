const joi = require("joi")
const errHandler = require("../middleware/errorhandler.js")

class Validation {
  
  static async registerValidation(req, res, next) {
    try {
      let schema;

      if (req.body.role && req.body.role.toLowerCase() === 'admin') {
        schema = joi.object({
          user_name: joi.string().required(),
          email_id: joi.string().email().required(),
          phone_number: joi.string().required(),
          password: joi.string().min(1).max(10).required(),
          role: joi.string().valid('admin').required(),
        }).unknown(true);
      } else {
        schema = joi.object({
          user_name: joi.string().required(),
          email_id: joi.string().email().required(),
          phone_number: joi.string().required(),
          password: joi.string().min(1).max(10).required(),
        });
      }

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

  static async loginValidation(req, res, next) {
    try {
      const schema = joi.object({
        email_id: joi.string().email().required(),
        password: joi.string().min(1).max(10).required(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

 static async forgetPasswordValidation(req, res, next) {
    try {
      const schema = joi.object({
        email_id: joi.string().email().required(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

  static async resetPasswordValidation(req, res, next) {
    try {
      const schema = joi.object({
        password: joi.string().min(1).max(10).required(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

 static async updateProfileValidation(req, res, next) {
    try {
      const schema = joi.object({
        email_id: joi.string().email().required(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

}
module.exports = Validation
