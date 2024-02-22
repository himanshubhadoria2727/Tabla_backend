const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { registerRoute } = require('./src/route')
const path = require('path')

require('dotenv').config()



const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use('/media', express.static(path.join(__dirname, "media")))




mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
    console.log("mongoose db are connected");
})
registerRoute(app)
app.listen(process.env.PORT, () => {
    console.log("app is listen ");
})



