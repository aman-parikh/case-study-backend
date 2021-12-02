const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://testuser:test1234@cluster0.lzems.mongodb.net/vaccine-data?retryWrites=true&w=majority", { useNewUrlParser: true }, { useUnifiedTopology: true }).then(() => {
  console.log('connection is successful');
}).catch(error => {
  console.log('connection failed: ' + error);
})
var apiData = {
  center_id: {
    type: Number,
    unique: true
  },
  name: String,
  state: String,
  district: String,
  pin: Number,
  address: String,
  dose_1: Number,
  dose_2: Number,
  vaccine: {
    coxain: Number,
    covishield: Number,
    sputnik: Number,
  }
}
const APIData = mongoose.model('api-data', new mongoose.Schema(apiData, { collection: 'api-data' }));
const getHospitalByDistrict = async (district) => {
  let res = APIData.findOne({ district: district })
  return res
}
module.exports.getHospitalByDistrict = getHospitalByDistrict
const getHospitalByPin = async (Pin) => {
  let res = APIData.find({ pin: Pin })
  return res
}
module.exports.getHospitalByPin = getHospitalByPin
const getHospitalById = async (center_id) => {
  let res = APIData.find({ _id: center_id })
  return res
}
module.exports.getHospitalById = getHospitalById
const decrementVaccine = (center_id, vaccName) => {
  if (vaccName === "sputnik") {
    return APIData.findOneAndUpdate({ _id: center_id }, { $inc: { "vaccine.sputnik": -1 } }, { multi: true })
  }
  else if(vaccName === "covishield") {
    return APIData.findOneAndUpdate({ _id: center_id }, { $inc: { "vaccine.covishield": -1 } }, { multi: true })
  }
  else{
    return APIData.findOneAndUpdate({ _id: center_id }, { $inc: { "vaccine.covaxin": -1 } }, { multi: true })
  }
}
const incrementVaccine = (center_id, vaccName) => {
  if (vaccName === "sputnik") {
    return APIData.findOneAndUpdate({ _id: center_id }, { $inc: { "vaccine.sputnik": 1 } }, { multi: true })
  }
  else if(vaccName === "covishield") {
    return APIData.findOneAndUpdate({ _id: center_id }, { $inc: { "vaccine.covishield": 1 } }, { multi: true })
  }
  else{
    return APIData.findOneAndUpdate({ _id: center_id }, { $inc: { "vaccine.covaxin": 1 } }, { multi: true })
  }
}
module.exports.decrementVaccine = decrementVaccine
module.exports.incrementVaccine = incrementVaccine