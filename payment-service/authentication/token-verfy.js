const jwt = require('jsonwebtoken');
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")
const Response = require("../response/Response")

const SECRETKEY = process.env.SECRETKEY

const tokenverfication = async (req, res, next) => {
    try {
      const accesstoken = req.headers.authorization;
  
      if (!accesstoken) {
        return Response.error(req, res, Httpcode.HTTP_BAD_REQUEST, null, Message[103]);
  
      }
      req.user = jwt.verify(accesstoken,SECRETKEY)
        next();  
      
      
    } catch (err) {
      next(err);
    }
  };
  module.exports = tokenverfication