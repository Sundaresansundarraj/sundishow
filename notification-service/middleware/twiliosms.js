const twilioConfig = require('../config/twilioconfig');
const twilio = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);


const sendOTP = async (phonenumber, otp) => {
    try {
        const message = await twilio.messages.create({
            body: `Your OTP for password reset: ${otp}`,
            from: twilioConfig.phoneNumber,
            to: phonenumber
        });
        console.log(`OTP sent to ${phonenumber}: ${otp}`);
        return true;
    } catch (error) {
        if (error.code === 21408) {
            console.error('SMS permissions not enabled for the specified region.');
        } else {
            console.error('Error sending OTP:', error);
        }
        return false;
    }
};

module.exports = sendOTP
