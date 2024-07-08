const cron = require('node-cron');
const User = require('../models/User');
const { Op } = require('sequelize');

const jj = cron.schedule('*/1 * * * *', async () => {
    console.log("Checking for expired OTPs...");
    
    
    const currentTime = new Date();

    try {
       
        const users = await User.findAll({
            where: {
                validtime: {
                    [Op.ne]: null,
                    [Op.lte]: currentTime 
                },
                otp: {
                    [Op.ne]: 0 
                }
            }
        });

        for (let user of users) {
            
            user.otp = 0;
            user.validtime = null
            await user.save();
            console.log(`Invalidated OTP for user ID ${user.user_id}`);
        }

        if (users.length === 0) {
            console.log("No expired OTPs found.");
        }
    } catch (error) {
        console.error("Error checking for expired OTPs:", error);
    }
});


module.exports = {jj}
