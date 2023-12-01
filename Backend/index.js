const connectToMongo = require('./db')
const express = require('express')

connectToMongo();



const app = express()
const port = 3000


// IMPORT THESE FROM EXPRESS JS DOCUMENTATION : https://expressjs.com/en/starter/hello-world.html

// app.get('/api/v1/login', (req, res) => {
//   res.send('Login here!')
// })
// app.get('/api/v1/signup', (req, res) => {
//   res.send('Signup here!')
// })

// app.get('/', (req, res) => {
//   res.send('Signup here!')
// })

// we need to use this middleware for request.body:
app.use(express.json())

// setting the path for the routes (OUR ROUTES ARE SET INSIDE THE ROUTES FOLDER FOR CLARITY)
app.use('/api/auth/', require('./routes/auth'))
app.use('/api/notes/', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})