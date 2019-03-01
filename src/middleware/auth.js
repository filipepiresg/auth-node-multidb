module.exports = (req, res, next) => {
  const { user, password } = req.body
  if (!user) return res.status(400).json({ message: "user not provided" })
  next()
}
