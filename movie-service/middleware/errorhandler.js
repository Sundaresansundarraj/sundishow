const joi = require("joi")

class errHandler {
   static errorHandler(err, req, res, next) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: `internal server error${e}`,
    });
  }

  static Errorhandler(err, req, res, next) {
    if (err instanceof joi.ValidationError) {
      res.status(400).json({ error: 'validation error', details: err.details[0].message });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = errHandler