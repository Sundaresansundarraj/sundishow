const Service = require("../services/booking-service.js")
const Response = require("../response/Response.js")

class Controller {
  static async  Booking(req, res, next) {
    try {
      const result = await Service.bookingService(req);

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller