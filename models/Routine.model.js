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
  daysPerWeek: {
    type: String,
    required: true,
  },
  length: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,

    enum: ["Beginner", "Intermediate", "Advanced"],

    required: true,
  },
  equipment: {
    type: String,

    enum: ["No equipment", "Dumbbells/Kettlebells", "Bands", "Barbell"],

    required: true,
  },
  exercises: [
    {
      name: String,
      repetitions: String,
    },
  ],
  notes: String,
  comments: [
    {
      author: String,
      content: String,
    },
  ],
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Routine = model("Routine", routineSchema);

module.exports = Routine;
