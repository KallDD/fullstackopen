const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const router = require('./controllers/routes')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/api/blogs', router)

module.exports = app