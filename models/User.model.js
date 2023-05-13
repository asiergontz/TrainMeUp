const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  biometrics: {
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
  },
  objective: {
    type: String,
    enum: ["Weight Loss", "Improve Health", "Gain weight"],
  },
  role: {
    type: String,
    default: "user",
  },
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer" },
  routines: [{ type: Schema.Types.ObjectId, ref: "Routine" }],
});

const User = model("User", userSchema);

module.exports = User;
