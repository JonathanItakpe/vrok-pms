const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const cors = require('cors')
const app = express()
const router = require('./router')

// Use validator for checking input data
app.use(expressValidator());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json 
app.use(bodyParser.json())
// Add Support for CORS
app.use(cors())
// Set up the router
router(app)

module.exports = app