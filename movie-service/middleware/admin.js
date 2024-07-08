const jwt = require('jsonwebtoken');
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")
const Response = require("../response/Response")

const SECRETKEY = process.env.SECRETKEY

const isAdmin = async (req, res, next) => {
    try {
      const accesstoken = req.headers.authorization;
  
      if (!accesstoken) {
        return Response.error(req, res, Httpcode.HTTP_BAD_REQUEST, null, Message[103]);
  
      }
      jwt.verify(accesstoken ,SECRETKEY , (err, decoded) => {
        const user_role = decoded.user_role;
          if (user_role !== 'admin') return res.status(403).json({ Error: 'Access denied. Only admins can perform this action.' });  
          next();  
      });
      
      
    } catch (err) {
      next(err);
    }
  };
  module.exports = isAdmin