const Screen = require("../models/Screen.js")
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")

class TheaterScreenService {
   static async addTheaterScreen(req) {
    try {
      const adminId = req.user.user_id;

      const { screen_name, theater_id } = req.body;
      const theater_screen_details = {
        screen_name,
        theater_id,
        admin_id: adminId,
      };

      const result = await Screen.create(theater_screen_details);
      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[214],
        data: result,
      };
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = TheaterScreenService