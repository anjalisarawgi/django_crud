const express = require('express')
const router = express.Router()
const Notes = require('../models/Notes')

var fetchUser = require('../middleware/FetchUser')

// ROUTE1: Get all the notes - get request /api/notes.fetchallnotes
router.get('/fetchallnotes', (req, res) => {

    
  })
  
module.exports = router

