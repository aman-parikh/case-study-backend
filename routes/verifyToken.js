const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY
function auth(req, res, next) {
  const token = req.header('auth-token')
  if (!token) return res.json({ status: '401 AUTH ERROR', message: 'Access has been denied' })
  try {
    var verification = jwt.verify(token, secretKey)
    req.user = verification
    next()
  }
  catch (err) {
    req.json({ status: '401 AUTH ERROR', message: 'Access has been denied (token mismatch)' })

  }
}
module.exports.auth = auth