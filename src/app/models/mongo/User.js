const Mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
      validate: {
        validator: function(name) {
          return name !== ""
        },
        msg: "This field should not be empty"
      }
    },
    email: {
      type: String,
      unique: true,
      required: [true, "The e-mail is required"],
      lowercase: true,
      validate: {
        validator: function(email) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)
        },
        msg: () => `This field must be an e-mail`
      }
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      select: false,
      validate: {
        validator: function(password) {
          return password.length >= 6 && password.length <= 20
        },
        msg: "The password field must be between 6 and 20 characters"
      }
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    _id: true,
    collection: "Users",
    versionKey: false
  }
)

UserSchema.pre("save", async function(next) {
  const modified = this.isModified("password")
  if (!modified) return next()

  this.password = await bcrypt.hash(this.password, 8)
  return next()
})

UserSchema.post("save", async function() {
  this.password = undefined
})

UserSchema.methods.checkPassword = function(data) {
  return bcrypt.compare(data, this.password)
}

UserSchema.methods.generateToken = function() {
  return jwt.sign({ _id: this._id }, process.env.APP_SECRETKEY)
}

module.exports = Mongoose.model("User", UserSchema)
