// importing express
const express = require('express')
// importing router from express
const router = express.Router()
// importing user from your schema
const User = require('../models/Users')
// importing based on express validation documentation
const { body, validationResult } = require('express-validator');

// importing bcrypt for hashkey : https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');
// for web tokens : https://www.npmjs.com/package/jsonwebtoken
var jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/FetchUser');


// using this to sign the activities of the webtoken -- it makes sure that no one is chaging the payload data to access others information illegaly
const JWT_SECRET = "anjaliisc$$l"


// -- AUTHENTICATION ENDPOINT --

// this format comes from express js: https://expressjs.com/en/starter/hello-world.html
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
// router.post comes from this format 


// FOLLOW THIS DOCUMENTATION FOR THE REST OF IT: https://express-validator.github.io/docs/

//ROUTE 1:
// 'creating a user' using 'post' and it doesnt require auth -- no login requeired -- api/auth/createuser is the new path as per the defination below
// the code below sets the validation criteria for each of the fields
router.post('/createuser', [
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('email', 'enter a valid email').isEmail(),
  body('password', 'enter a password - min length').isLength({ min: 5 }),
]
  // async -> await -> promisses
  // if you dont use async, your requests wont run as they wont run on the background - ifykyk
  , async (req, res) => {

    // if there are return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check whether the user with this email already exists
    // using try and catch to check for unseen errors
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ error: "sorry a user with this email aready exist" })
      }

      const salt = await bcrypt.genSalt(10);
      // await in salt says 'wait, let me generate a salt and then go to the next step to create hash'
      // excellent security reasons
      const securedPassword = await bcrypt.hash(req.body.password, salt);

      // pulling the values (from express validation)
      user = await User.create({
        name: req.body.name,
        // password: req.body.password,
        password: securedPassword,
        email: req.body.email
      })
      // catching the id from indexes and using that to run our token
      const data = {
        user: {
          id: user.id
        }
      }

      //not using await as .sign is 'syncronous'
      const authtoken = jwt.sign(data, JWT_SECRET);
      // .then(user => res.json(user))
      // .cath(err=> {console.log(err)
      // res.json({error: 'Please enter a valid email'})})

      // res.json(user) shows the output so we can define something at 'user'

      // you can check for 'some error occured' by harcoding something like Userb
      res.json({ authtoken })
    }

    // lets not use user in res.json and send only token. the best way to have quick authentication is to have res.json through ids (as it is an index in our database)
    catch (error) {
      console.log(error.message)
      res.status(500).send('Internal Server Error')
    }
  })








// ROUTE 2: authenticate a user /api/auth/login
router.post('/login', [
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password cannot be blank').exists()
]
  , async (req, res) => {
    // if there are return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    // using destructuring method to pull email and password from req.body
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "sorry please try to login with correct credentials" })
      }

      // matching the passwords (password is the entered password and user.password is the one that is stored)
      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
        return res.status(400).json({ error: "sorry please try to login with correct credentials" })
      }
      //signature
      // the code below send userid to the auth token which means our auth token as a decoded user id in it which we can pull later
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken })

    } catch (error) {
      console.log(error.message)
      res.status(500).send('Internal Server Error')
    }
  })






// ROUTER 3: get logged in user's details /getuser
// here because this requires logging in first, we need to authenticate using the authtoken. so, we need to find a way to pass the token
router.post('/getuser', fetchUser, async (req, res) => {
  // if there are return bad request and errors
  try {
    //fetching user ID from the request
    userID = req.user.id
    // to select the user information using userID
    const user = await User.findById(userID).select("-password")
    //response
    res.send(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Internal Server Error')
  }
})


module.exports = router