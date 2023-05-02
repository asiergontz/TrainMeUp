const { Schema, model } = require("mongoose");

const routineSchema = new Schema({
  bodyPart: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  exercises: {
    type: [String],
    required: true,
  },
  length: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["begginer", "intermediate", "advanced"],
    required: true,
  },
  comments: [String],
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Routine = model("Routine", routineSchema);

module.exports = Routine;
