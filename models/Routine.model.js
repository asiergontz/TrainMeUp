const { Schema, model } = require("mongoose");

const routineSchema = new Schema({
  routineName: {
    type: String,
    required: true,
  },

  bodyPart: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  exercises: [
    {
      name: String,
      repetitions: Number,
    },
  ],
  length: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,

    enum: ["Beginner", "Intermediate", "Advanced"],

    required: true,
  },
  comments: [
   {
    author: String,
    content: String
  }
],
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Routine = model("Routine", routineSchema);

module.exports = Routine;
