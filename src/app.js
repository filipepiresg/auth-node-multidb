require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
})
const express = require("express")

const routes = require("./routes")

const App = express()

//  Middlewares
App.use(express.json())

//  Routes
App.use(routes)

module.exports = App
