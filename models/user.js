const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://testuser:test1234@cluster0.lzems.mongodb.net/vaccine-data?retryWrites=true&w=majority", { useNewUrlParser: true }, { useUnifiedTopology: true }).then(() => {
  console.log('connection is successful');
}).catch(error => {
  console.log('connection failed: ' + error);
})

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    max: 150,
    min: 4
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    district: String,
    city: String,
    pincode: String,
  },
  phoneNumber: Number,
  vaccinationStatus: {
    dose1: Boolean,
    dose2: Boolean
  },
}, { collection: 'users' })
const User = new mongoose.model("user", user)
const addUser = async (name, email, password, dob, district, city, pincode, phoneNumber, dose1, dose2) => {
  return User.insertMany(new User({
    name: name,
    email: email,
    password: password,
    dob: dob,
    address: {
      district: district,
      city: city,
      pincode: pincode
    },
    phoneNumber: phoneNumber,
    vaccinationStatus: {
      dose1: dose1,
      dose2: dose2
    }
  }))
}
const updateUserVaccinations = async (user_id, dose) => {
  return User.findOneAndUpdate({
    _id: user_id
  }, {
    vaccinationStatus: {
      dose1: dose1,
      dose2: dose2
    }
  }, { upsert: true, useFindAndModify: false });
}
const getUserByName = async (name) => {
  console.log("name: " + name)
  return User.find({ name: name })
}
const getUserByEmail = async (email) => {
  let result = User.findOne({ email: email })
  return result
}
const getUserById = async (user_id) => {
  let result = User.findOne({ _id: user_id })
  return result
}
module.exports.addUser = addUser
module.exports.getUserByName = getUserByName
module.exports.getUserByEmail = getUserByEmail
module.exports.getUserById = getUserById