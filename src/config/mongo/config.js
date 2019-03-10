require("dotenv").config({
  path: /* process.env.NODE_ENV === "test" ? ".env.test" : */ ".env"
})

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}
