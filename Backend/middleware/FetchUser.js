// making a middleware - fetchuser
var jwt = require('jsonwebtoken');
const JWT_SECRET = "anjaliisc$$l"


//next calls the next middleware that in async(res,req) in auth.js
const fetchUser = (req, res, next) => {
    const mytoken = req.header('auth-token') // this is the header we are going to use to send our request
    if (!mytoken) {
        return res.status(401).json({ error: 'Please authenticate using a valid token' })
    }
    try {
        const data = jwt.verify(mytoken, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ error: 'Please authenticate using a valid token' })
    }
}

module.exports = fetchUser