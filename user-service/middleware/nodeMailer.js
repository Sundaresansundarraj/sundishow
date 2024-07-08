const transporter = require("../config/nodeConfig");

const EMAIL_USER = process.env.EMAIL_USER;

async function sendMail(email, user_id) {

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'reset password',
    text: `http://localhost:3000/resetPassword/${user_id}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      res.json({ Status: 'Email sent successfully:' });
    }
  });
}
module.exports = sendMail
