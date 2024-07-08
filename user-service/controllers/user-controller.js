const UserService = require("../services/user-service")
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")
const Response = require("../response/Response")


class UserController {

  static async signup(req, res, next) {
    try {
      const result = await UserService.signup(req.body);
      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess  (req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await UserService.login(req.body);
      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async forgetPassword(req, res, next) {
    try {
      const result = await UserService.forgetPassword(req);
      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async generateAndSendOTP(req, res, next) {
    try {
      const result = await UserService.generateAndSendOTP(req);
      if (!result.sucess) {
        return Response.error(req, res, Httpcode.HTTP_BAD_REQUEST, null, Message[123]);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }
  static async verifypassword(req, res, next) {
    try {
      const result = await UserService.verifypassword(req);
      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }


  static async resetPassword(req, res, next) {
    try {
      const result = await UserService.resetPassword(req);
      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async getAllUser(req, res, next) {
    try {
      const result = await UserService.getAllUsers(req);
      if (!result.sucess) {
        return Response.error(req, res, Httpcode.HTTP_BAD_REQUEST, null, Message[123]);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async getSpecficUser(req, res, next) {
    try {
      const result = await UserService.getspecficUser(req);
      if (!result.sucess) {
        return Response.error(req, res, Httpcode.HTTP_BAD_REQUEST, null, Message[124]);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const result = await UserService.UpdateProfile(req);

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = UserController