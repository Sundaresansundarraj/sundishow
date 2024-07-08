const seatservices = require("../services/seat-service")
const Response = require("../response/Response.js")

class seatController {
  static async addseatNumberController(req, res, next) {
    try {
      const result = await seatservices.addSeatNumber(req);

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = seatController