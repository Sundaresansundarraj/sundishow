const user = require("../models/User")

const isAdmin = async (req, res, next) => {
  const userId = req.user.user_id;
  const users = await user.findByPk(userId);

  if (!users || users.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Only admins can perform this action.' });
  }

  next();
};
module.exports = isAdmin