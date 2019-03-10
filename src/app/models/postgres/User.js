const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "This field should not be empty"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "This field must be an e-mail"
          }
        }
      },
      password: {
        type: DataTypes.VIRTUAL,
        required: true,
        validate: {
          len: {
            args: [6, 20],
            msg: "The password field must be between 6 and 20 characters"
          }
        }
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeValidate: async user => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8)
          }
        }
      },
      tableName: "TB_USERS"
    }
  )

  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password_hash)
  }

  User.prototype.generateToken = function() {
    return jwt.sign({ id: this.id }, process.env.APP_SECRETKEY)
  }

  return User
}
