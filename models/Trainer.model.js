const { Schema, model } = require("mongoose");

const trainerSchema = new Schema({
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
  clients: [{ type: Schema.Types.ObjectId, ref: "User" }],
  routines: [{ type: Schema.Types.ObjectId, ref: "Routine" }],
});

const Trainer = model("Trainer", trainerSchema);

module.exports = Trainer;
