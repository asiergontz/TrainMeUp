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
    required: true,
  },
  biometrics: {
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  objective: {
    type: String,
    enum: ["Weight Loss", "Improve Health", "Gain weight"],
  },
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer" },
  routines: [{ type: Schema.Types.ObjectId, ref: "Routine" }],
});

const User = model("User", userSchema);

module.exports = User;
