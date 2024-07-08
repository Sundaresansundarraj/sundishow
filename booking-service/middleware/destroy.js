const booking = require("../models/Booking")


async function releaseSeatsAndCancelBooking(bookingId) {
    try {
        const deletedRows = await booking.destroy({
            where: { booking_id: bookingId },
        });

        if (deletedRows > 0) {
            
            clearTimeout(bookingTimeouts[bookingId]);

            console.log(`Booking with ID ${bookingId} has been canceled, and seats released.`);
        } else {
            console.log(`Booking with ID ${bookingId} not found.`);
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}
module.exports= releaseSeatsAndCancelBooking

