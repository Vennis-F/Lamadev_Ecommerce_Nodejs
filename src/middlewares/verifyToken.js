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
    if (err) return res.status(403).json({ error: "You are not authenticated" })

    //Set token to requset
    req.user = user
    next()
  })
}

//Check authorization: user_1 - admin_user
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || isAdmin) {
      next()
    } else return res.status(403).json({ error: "" })
  })
}
module.exports = { verifyToken, verifyTokenAndAuthorization }
