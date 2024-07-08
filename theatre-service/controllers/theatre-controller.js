const TheaterService = require("../services/theatre-service.js")
const Response = require("../response/Response.js")

class TheatreController {
  static async addtheater(req, res, next) {
    try {
      const result = await TheaterService.addTheater(req);

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async getTheaterByLocation(req, res, next) {
    try {
      const result = await TheaterService.getTheaterbyLocation(req);
      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async getSpecficTheaterMovies(req, res, next) {
    // const {theater_id} = req.body
    try {
      const result = await TheaterService.getSpecficTheaterbyMovies(req);

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TheatreController