const theaterScreenService = require("../services/screen-service.js")
const Response = require("../response/Response.js")


class ScreenController {
 
   static async addtheaterScreenController(req, res, next) {
    try {
      const result = await theaterScreenService.addTheaterScreen(req);

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ScreenController