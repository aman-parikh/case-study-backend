var router = require('express').Router()
require('dotenv').config()
const hospQueries = require('../models/hospital.js')
router.get('/district', async (req, res) => {
  district = req.body.district
  let result = await hospQueries.getHospitalByDistrict(district) || "no info"
  console.log(result)
  if (result)
    return res.status(200).json({
      status: "200 OK",
      data: result
    })
  else{
    return res.status(200).json({
      status: "200 OK",
      data: "NA"
    })
  }
})
router.get('/pin', async (req, res) => {
  pin = req.body.pin
  let result = await hospQueries.getHospitalByPin(pin) || "no info"
  console.log(result)
  if (result)
    return res.status(200).json({
      status: "200 OK",
      data: result
    })
  else{
    return res.status(200).json({
      status: "200 OK",
      data: "NA"
    })
  }
})
router.get('/get', async (req, res) => {
  center_id = req.body.center_id
  let result = await hospQueries.getHospitalById(center_id) || "no info"
  console.log(result)
  if (result)
    return res.status(200).json({
      status: "200 OK",
      data: result
    })
  else{
    return res.status(200).json({
      status: "200 OK",
      data: "NA"
    })
  }
})
module.exports = router