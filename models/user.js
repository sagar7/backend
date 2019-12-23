const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 50
  },
  password: {
    type: String,
    min: 8,
    max: 100
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  editedBy:{
    type:String
  }
});
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role,
      email:this.email  
    },
    process.env.SECRET_KEY
  );
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const Schema = {
    email: joi
      .string()
      .email()
      .required(),
    password: joi
      .string()
      .min(8)
      .max(100)
      .required(),
    name: joi
      .string()
      .min(3)
      .max(50)
      .required(),
    role:joi.string().required()
  };
  return joi.validate(user, Schema);
}
exports.User = User;
exports.validate = validateUser;
