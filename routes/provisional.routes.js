const express = require("express");
const router = express.Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const Routine = require("../models/Routine.model");
const Trainer = require("../models/Trainer.model");

//SIGN UP TRAINERS
router.get("/signup-trainer", (req, res, next) => {
  res.render("auth/signup-trainer");
});

router.post("/signup-trainer", (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!name || !email || !password || !phoneNumber) {
    res.status(400).render("auth/signup-trainer", {
      errormessage:
        "All fields are mandatory. Please provide all requested fields.",
    });
    return;
  }
  Trainer.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      res.status(400).render("auth/signup-trainer", {
        errormessage: "This email already exists. Please provide a new email.",
      });
      return;
    }
  });
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    res.render("auth/signup-trainer", {
      errorMessage:
        "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return Trainer.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => next(err));
});

//CLIENT REGISTRATION

router.get("/client-registration", (req, res, next) => {
  res.render("trainer/client-registration");
});

router.post("/client-registration", (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).render("trainer/client-registration", {
      errormessage:
        "All fields are mandatory. Please provide all requested fields.",
    });
    return;
  }
  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      res.status(400).render("trainer/client-registration", {
        errormessage: "This email already exists. Please provide a new email.",
      });
      return;
    }
  });
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        name,
        email,
        password: hashedPassword,
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => next(err));
});

module.exports = router;
