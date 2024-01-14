const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "an email is required"],
    validate: [validator.isEmail, "This is not a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "A password is required"],
    minLength: [8, "Your password must be 8 or more characters"],
    select: false,
    // validate:{
    //     validator:function(val){
    //         return val
    //     }
    // }
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Your password must match",
    },
  },
  passwordChangedAt: {
    type: Date,
    selected: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isCorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
