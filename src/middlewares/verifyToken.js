const jwt = require("jsonwebtoken")

//Check token valid or not (!miss expire date)
const verifyToken = (req, res, next) => {
  let authHeader = req.headers.token

  //Check have token
  if (!authHeader) {
    return res.status(401).json({ error: "You are not authenticated" })
  }

  authHeader = authHeader.split(" ")[1]
  jwt.verify(authHeader, process.env.SEC_JWT, (err, user) => {
    //Check token valid
    if (err) return res.status(403).json({ error: "Token is not valid" })

    //Set token to requset
    req.user = user
    next()
  })
}

//Check authorization: user_1 - admin_all
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else
      return res.status(403).json({ error: "You are not allow to do that" })
  })
}

//Check authorization: user_1 - admin_all
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else
      return res.status(403).json({ error: "You are not allow to do that" })
  })
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
}
