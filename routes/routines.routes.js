const express = require("express");
const router = express.Router();

const Routine = require("../models/Routine.model");
const User = require("../models/User.model");
const Trainer = require("../models/Trainer.model");

const setUserRole = require("../middleware/userRole");
const userLoggedIn = require("../middleware/isLoggedIn");

module.exports = router;
