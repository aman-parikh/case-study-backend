var router = require('express').Router()
require('dotenv').config()
const bookQueries = require('../models/bookings.js')
const hospQueries = require('../models/hospital.js')

router.put('/cancel', async (req, res) => {
  booking_id = req.body.booking_id
  center_id = req.body.center_id
  vaccName = req.body.vaccName
  let updateHospital = hospQueries.incrementVaccine(center_id, vaccName)
  updateHospital.then((data) => {
    console.log(data)
  }).catch((err) => {
    console.log(err.message)
    return res.status(304).json({ status: '304 DB ERROR', error: err.message })
  })
  let result = bookQueries.findAndDeleteBooking(booking_id)
  result.then((data) => {
    return res.status(200).json({ status: '200 OK', data: data })
  }).catch((err) => {
    console.log(err.message)
    return res.status(304).json({ status: '304 DB ERROR', error: err.message })
  })
})
router.post('/create', async (req, res) => {
  user_id = req.body.user_id
  center_id = req.body.center_id
  date = req.body.date
  slot = req.body.slot
  vaccName = req.body.vaccName
  dose = req.body.dose
  console.log(req.body.center_id)
  let updateHospital = hospQueries.decrementVaccine(center_id, vaccName)
  updateHospital.then((data) => {
    console.log(data)
  }).catch((err) => {
    console.log(err.message)
    return res.status(304).json({ status: '304 DB ERROR', error: err.message })
  })
  let result = bookQueries.bookVaccine(center_id, user_id, date, slot, vaccName, dose) || "no info"
  result.then((data) => {
    return res.status(200).json({ status: '200 OK', data: data })
  }).catch((err) => {
    console.log(err.message)
    return res.status(304).json({ status: '304 DB ERROR', error: err.message })
  })
})
router.put('/get', async (req, res) => {
  user_id = req.body.user_id
  let result = bookQueries.getByUserId(user_id) || null
  if (result) {
    result.then((data) => {
      return res.status(200).json({ status: '200 OK', data: data })
    }).catch((err) => {
      console.log(err.message)
      return res.status(304).json({ status: '304 DB ERROR', error: err.message })
    })
  }
})
module.exports = router