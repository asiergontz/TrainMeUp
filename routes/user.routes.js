const express = require("express");
const router = express.Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const Routine = require("../models/Routine.model");
const Trainer = require("../models/Trainer.model");

//Log in routes
router.get("/login-user", (req, res, next) => {
  res.render("auth/login-user");
});

router.post("/login-user", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("auth/login-user", {
      errormessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  }
  // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
  //   res.render("auth/login-user", {
  //     errorMessage:
  //       "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
  //   });
  //   return;
  // }
  User.findOne({ email })
    .populate("routines")
    .then((dbUser) => {
      if (!dbUser) {
        res.render("auth/login-user", {
          errormessage: "Email is not registered. Try with other email.",
        });
        return;
      }
      // const samePassword = bcryptjs.compareSync(password, dbUser.password);
      // if (!samePassword) {
      //   res.render("auth/login-user", {
      //     errormessage: "Incorrect password. Please try again",
      //   });
      //   return;
      // }
      req.session.currentUser = dbUser;
      res.render("user/user-dashboard", { user: dbUser });
    })
    .catch((error) => next(error));
});

// Dashboard
//User's data
//Complete data form (First time)
router.get("/data-create", (req, res, next) => {
  res.render("user/data-create");
});

router.post("/data-create", (req, res, next) => {
  const { name, email, password, phoneNumber, height, weight, objective } =
    req.body;
  User.findOneAndUpdate(email, {
    name,
    password,
    phoneNumber,
    height,
    weight,
    objective,
  })
    .then((updatedUser) => {
      // req.session.currentUser = updatedUser;
      res.render("user/user-dashboard", { user: updatedUser });
    })
    .catch((err) => next(err));
});

//Update data form
router.get("/data-update", (req, res, next) => {
  res.render("user/data-update");
});

router.post("/data-update", (req, res, next) => {
  const { height, weight, objective } = req.body;
  User.findOneAndUpdate(email, {
    height,
    weight,
    objective,
  })
    .then(() => {
      res.render("user/user-dashboard");
    })
    .catch((err) => next(err));
});

//Routines
//Routine details
router.get("/routine-details/:id", (req, res) => {
  Routine.findById(req.params.id)
    .then((routineDetails) => {
      res.render("/routine-details", routineDetails);
    })
    .catch((error) => next(error));
});

// Test user
// User.create({
//   name: "test1",
//   email: "test1@gmail.com",
//   password: 1234,
//   phoneNumber: 1234,
//   biometrics: { height: 1.68, weight: 56 },
//   objective: "Improve Health",
// });

//Test routine
// Routine.create({
//   bodyPart: "shoulders",
//   day: "2",
//   exercises: [
//     { name: "exercise1", repetitions: 2 },
//     { name: "exercise2", repetitions: 4 },
//   ],
//   length: "45 min",
//   difficulty: "Beginner",
//   user: "645538547b45f8e137c0d118",
// });

module.exports = router;
