const jwt = require('jsonwebtoken')

const config = process.env

const auth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.user = decoded
    req.user.communityId = parseInt(req.headers.communityid)
  } catch (err) {
    return res.status(401).send('Invalid Token')
  }
  return next()
}

module.exports = auth
