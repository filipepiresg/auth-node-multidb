const Router = require("express").Router()

// const authMiddleware = require("./middleware/auth")

Router.get("/login", (req, res) => {
  return res.status(200).json({ message: "OK" })
})

// Router.use(authMiddleware)
// Router.get("/dashboard", (req, res) => {
//   return res.status(200)
// })

module.exports = Router
