const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")
// const sendMail = require("../middleware/nodeMailer")
const {sendMessage,sendsms} = require("../middleware/rabbitMq")
const generateOTP = require("../middleware/otpgenerater");
const { date } = require('joi');

const SALTROUND = process.env.SALTROUND
const SECRETKEY = process.env.SECRETKEY

class UserService {
  
  static async signup(req) {
    try {
      const {
        user_name, email_id, phone_number, password, role,
      } = req;
      const signUpDetiles = {
        user_name,
        email_id,
        phone_number,
        password,
        role: role || 'user',
      };

      const isUserExist = await User.findAll({ where: { email_id: signUpDetiles.email_id } });
      if (isUserExist.length) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[100],
        };
      }
      const hashedPassword = await bcrypt.hash(signUpDetiles.password, Number(SALTROUND));
      signUpDetiles.password = hashedPassword;
      const result = await User.create(signUpDetiles);
      delete result.dataValues.password;
      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[200],
        data: result,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async login(req) {
    try {
      const { email_id, password } = req;
      const loginDetiles = {
        email_id,
        password,
      };

      const result = await User.findOne({ where: { email_id: loginDetiles.email_id } });

      if (!result) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[101],
        };
      }
      const isValidPassword = await bcrypt.compare(password, result.dataValues.password);
      if (!isValidPassword) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[102],
        };
      }

      if (result.dataValues.is_active === 0) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[109],

        };
      }

      if (result.dataValues.is_deleted === 1) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[110],
        };
      }

      const payload = {
        user_id: result.dataValues.user_id,
        user_name: result.dataValues.user_name,
        email_id: result.dataValues.email_id,
        phone_number: result.dataValues.phone_number,
        user_role:result.dataValues.role

      };
      const acess_token = jwt.sign(payload,SECRETKEY);

      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[201],
        data: acess_token,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async getAllUsers(req) {
    try {
      let result = await User.findAll();
      for (const res of result) {
        delete res.dataValues.phone_number
        delete res.dataValues.password
        delete res.dataValues.role
      }

      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[217],
        data: result,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async getspecficUser(req) {
    try {
      const userId = req.user.user_id;
      const result = await User.findOne({ where: { user_id: userId } });
      delete result.dataValues.password;
      delete result.dataValues.phone_number;
      delete result.dataValues.role;
      delete result.dataValues.is_active;
      delete result.dataValues.is_deleted;
      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[218],
        data: result
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async UpdateProfile(req) {
    try {
      const userId = req.user.user_id;
      const { email_id } = req.body;

      const update = await User.update(
        { email_id },
        { where: { user_id: userId } },
      );

      if (update > 0) {
        return {
          sucess: true,
          status: Httpcode.HTTP_OK,
          message: Message[206],
        };
      }

      return {
        sucess: false,
        status: Httpcode.HTTP_BAD_REQUEST,
        message: Message[111],
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async forgetPassword(req) {
    try {
      const { email_id } = req.body;

      const isUserExist = await User.findOne({ where: { email_id } });
      if (!isUserExist) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[104]
        }
      }

      const user_id  = isUserExist.dataValues.user_id;

      if (!isUserExist) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[101],
        };
      }

      if (isUserExist.dataValues.is_active === 0) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[109],

        };
      }

      if (isUserExist.dataValues.is_deleted === 1) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[110],
        };
      }

      // await sendMail(email_id, user_id);
      //  const orderMessage = { email_id, user_id };
       await sendMessage(email_id, user_id);

      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[208],
      };
    } catch (e) {
      console.log(e);
    }
  }
  static async generateAndSendOTP(req) {
    try{
    const userId = req.user.user_id;
    const result = await User.findOne({ where: { user_id: userId } });
    const phonenumber=  result.dataValues.phone_number;
    const otp = generateOTP()
    await sendsms(phonenumber, otp);
    // User.otp = otp
    const validtime = Date.now()
    await User.update({ otp: otp ,validtime:validtime}, {
      where: {
        user_id: userId

      },
    })

    return { sucess: true,status: Httpcode.HTTP_OK, message: Message[123] };
    }catch (e) {
      console.log(e);
    }
    
};

 static async verifypassword(req){
  try {
    const userId = req.user.user_id;
    const { otp } = req.body;
    const result = await User.findOne({ where: { user_id: userId } });
    const opts = result.dataValues.otp
    if (opts !== otp) {
      return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[124],
        };
      }

      const payload = {
        user_id: result.dataValues.user_id,
        otp:result.dataValues.otp
      };
      const acess_token = jwt.sign(payload,SECRETKEY);
      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[201],
        data: acess_token,
      };
    }
      catch (e) {
        console.log(e);
      }

}

  static async resetPassword(req) {
    try {
      const user_id = req.params.id;
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, Number(SALTROUND));
      const update_password = await User.update({ password: hashedPassword }, {
        where: {
          user_id,

        },
      });
      if (update_password > 0) {
        return {
          sucess: true,
          status: Httpcode.HTTP_OK,
          message: Message[207],
        };
      }

      return {
        sucess: false,
        status: Httpcode.HTTP_BAD_REQUEST,
        message: Message[111],
      };
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = UserService
