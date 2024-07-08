const Seat = require("../models/Seat")
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")

class seatService {
  static async addSeatNumber(req) {
    try {
      const adminId = req.user.user_id;
      const { screen_id, theater_id } = req.body;

      const seatNumbers = Array.from({ length: 100 }, (_, index) => ({
        seat_number: `Seat-${index + 1}`,
        screen_id,
        theater_id,
        admin_id: adminId,
      }));

      const result = await Seat.bulkCreate(seatNumbers);

      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[215],
        data: result,
      };
    } catch (e) {
      console.log(e);
      return {
        sucess: false,
        status: Httpcode.HTTP_INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        data: null,
      };
    }
  }
}

module.exports = seatService