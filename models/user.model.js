const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
        type: String,
        default: "./uploads/profil/random-user.png"
    },
    bio: {
      type: String,
      max: 1024,
    },
    followers: {
      type: [String],
    },
    followings: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//play function before save into db
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    //next veut dire "passe à la suite" en node js
    next();
})

//compare les mots de passe lors du login
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if(user) {
    const auth = await bcrypt.compare(password, user.password);
    if(auth) {
      return user;
    }
    throw Error('incorect password');
  }
  throw Error('incorect email');
}

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
