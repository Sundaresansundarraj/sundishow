const joi = require("joi")
const errHandler = require("../middleware/errorhandler")

class Validation {
  
  static async addMoviesValidation(req, res, next) {
    try {
      const schema = joi.object({
        movie_title: joi.string().required(),
        release_date: joi.date().required(),
        duration: joi.string().required(),
        total_seats: joi.number().required(),
        theater_id: joi.number().required(),
        screen_id: joi.number().required(),

      });

      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      errHandler.Errorhandler(err, req, res, next);
    }
  }

    
  static async addMoviesSlotValidation(req, res, next) {
     const toMysqlDatetime=(dateString)=> {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;}
    try {
        const schema = joi.object({
            movie_id: joi.number().required(),
            start_time: joi.date().iso().required(),
            end_time: joi.date().iso().min(joi.ref('start_time')).required(),
            price: joi.number().required(),
            available_seats: joi.number().required(),
        });

        const value = await schema.validateAsync(req.body);

        value.start_time = toMysqlDatetime(value.start_time);
        value.end_time = toMysqlDatetime(value.end_time);

        req.body = value;

        next();
    } catch (err) {
        errHandler.Errorhandler(err, req, res, next);
    }
}


}
module.exports = Validation
