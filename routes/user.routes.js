const express = require("express");
const router = express.Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const Routine = require("../models/Routine.model");
const Trainer = require("../models/Trainer.model");

//Log in routes
router.get("/login", (req, res, next) => {
  res.render("auth/login-user");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("/auth/login-user", {
      errormessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    res.render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }
  User.findOne({ email })
    .then((dbUser) => {
      if (!dbUser) {
        res.render("auth/login-user", {
          errormessage: "Email is not registered. Try with other email.",
        });
        return;
      }
      const samePassword = bcryptjs.compareSync(password, dbUser.password);
      if (!samePassword) {
        res.render("auth/login", {
          errormessage: "Incorrect password. Please try again",
        });
        return;
      }
      res.redirect("/user-dashboard");
    })
    .catch((error) => next(error));
});

// Dashboard

//User's routine details
router.get("/routine/:id", (req, res) => {
  Routine.findById(req.params.id).then((routineDetails) => {
    res.render("/routine-details", routineDetails);
  });
});

module.exports = router;
