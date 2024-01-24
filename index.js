const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { registerRoute } = require('./src/route')

require('dotenv').config()



const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
    console.log("mongoose db are connected");
})
registerRoute(app)
app.listen(process.env.PORT, () => {
    console.log("app is listen ");
})



