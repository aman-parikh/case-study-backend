const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://testuser:test1234@cluster0.lzems.mongodb.net/vaccine-data?retryWrites=true&w=majority", { useNewUrlParser: true }, { useUnifiedTopology: true }).then(() => {
  console.log('connection is successful');
}).catch(error => {
  console.log('connection failed: ' + error);
})
var booking = {
  center_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  user_id: mongoose.Schema.Types.ObjectId,
  date: Date,
  slot: Number,
  vaccine: {
    name: String,
    dose: Number,
  }
}
const Booking = mongoose.model('booking', new mongoose.Schema(booking, { collection: 'bookings' }));
const bookVaccine = async (center_id, user_id, date, slot, vaccName, dose) => {
  return Booking.insertMany(new Booking({
    center_id: center_id,
    user_id: user_id,
    date: date,
    slot: slot,
    vaccine: {
      name: vaccName,
      dose: dose
    }
  }))
}
const findAndDeleteBooking = async (booking_id) => {
  return Booking.findOneAndDelete({
    _id: booking_id
  }
  )
}
const getByUserId = async (user_id) => {
  return Booking.find({ user_id: user_id })
}
const getById = async (booking_id) => {
  return Booking.find({ _id: booking_id })
}
module.exports.bookVaccine = bookVaccine
module.exports.getByUserId = getByUserId
module.exports.getById = getById
module.exports.findAndDeleteBooking = findAndDeleteBooking
