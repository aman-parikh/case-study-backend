const axios = require('axios')
var router = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.SECRET_KEY
const userQueries = require('../models/user.js')
var bcrypt = require('bcryptjs');
//route for registering a user

const external = async(method,endpoint,body)=>{
  axios({
    method: `${method}`,
    url: `http://localhost:5300/user/${endpoint}`,
    data: body, // you are sending body instead
    headers: {
     // 'Authorization': `bearer ${token}`,
    'Content-Type': 'application/json'
    }, 
  })
}
router.post('/register', async (req, res) => {
  
  email = req.body.email
  let thisUser = await userQueries.getUserByEmail(email)
  if (thisUser) {
    return res.status(200).json({ status: '200 OK', message: 'User with email exists' })
  }
  name = req.body.name
  password = req.body.password
  dob = req.body.dob
  email = req.body.email
  district = req.body.district
  city = req.body.city
  pincode = req.body.pincode
  dose1 = req.body.dose1 === "true"
  dose2 = req.body.dose2 === "true"
  phoneNumber = req.body.phoneNumber
  //hashing password
  var salt = await bcrypt.genSaltSync(10)
  var hashedPassword = await bcrypt.hash(password, salt)
  let result = userQueries.addUser(
    name, email, hashedPassword, dob, district, city, pincode, phoneNumber, dose1, dose2
  )
  result.then((data) => {
    external('post','register',req.body)
    return res.status(200).json({ status: '200 OK', data: data })
  }).catch((err) => {
    console.log(err.message)
    return res.status(304).json({ status: '304 DB ERROR', error: err.message })
  })
})
//router for loggin in a user
router.put('/login', async (req, res) => {
  email = req.body.email
  password = req.body.password
  let result = await userQueries.getUserByEmail(email)
  if (!result) {
    return res.json({ error: 'User not found' })
  }
  else {
    console.log(result)
    const validPassword = await bcrypt.compare(password, result.password)
    console.log(validPassword)
    if (!validPassword) {
      return res.json({ error: 'Password mismatch' })
    }
    else {
      const token = jwt.sign({ _id: result.id }, secretKey)
      return res.header('auth-header', token).json({ message: 'Password is correct', token: token, data: result })
    }
  }
})
router.put('/getById', async function (req, res) {
  user_id = req.body.user_id
  let result = userQueries.getUserById(user_id)
  if (result) {
    result.then((data) => {
      return res.status(200).json({ status: '200 OK', data: data })
    }).catch((err) => {
      return res.status(304).json({ status: '304 DB ERROR', error: err.message })
    })
  }
})
module.exports = router