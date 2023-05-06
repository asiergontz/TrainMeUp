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
      res.redirect("/user/user-dashboard");
    })
    .catch((error) => next(error));
});

// DASHBOARD
router.get("/user-dashboard", (req, res, next) => {
  const loggedUser = req.session.currentUser;
  User.findById(loggedUser._id)
    .then((loggedUserData) => {
      Routine.find({ user: loggedUser._id }).then((routines) => {
        res.render("user/user-dashboard", {
          user: loggedUserData,
          routines: routines,
        });
      });
    })
    .catch((err) => next(err));
});
//User's data
//Complete data form (First time)
router.get("/data-create", (req, res, next) => {
  const loggedUser = req.session.currentUser;
  User.findById(loggedUser._id)
    .then((userData) => {
      res.render("user/data-create", { userData });
    })
    .catch((err) => next(err));
});

router.post("/data-create", (req, res, next) => {
  const loggedUserId = req.session.currentUser._id;
  const { name, password, phoneNumber, height, weight, objective } = req.body;
  User.findByIdAndUpdate(
    loggedUserId,
    {
      name,
      password,
      phoneNumber,
      biometrics: {
        height,
        weight,
      },
      objective,
    },
    { new: true }
  )
    .then((updatedData) => {
      req.session.currentUser = updatedData;
      res.redirect("/user/user-dashboard");
    })
    .catch((err) => next(err));
});

//Update data form
router.get("/data-update", (req, res, next) => {
  const loggedUser = req.session.currentUser;
  User.findById(loggedUser._id)
    .then((userData) => {
      res.render("user/data-update", { userData });
    })
    .catch((err) => next(err));
});

router.post("/data-update", (req, res, next) => {
  const loggedUserId = req.session.currentUser._id;
  const { height, weight, objective } = req.body;
  User.findByIdAndUpdate(loggedUserId, {
    biometrics: {
      height,
      weight,
    },
    objective,
  })
    .then((updatedData) => {
      req.session.currentUser = updatedData;
      res.redirect("/user/user-dashboard");
    })
    .catch((err) => next(err));
});

//Routines
//Routine details
router.get("/routine-details/:id", (req, res) => {
  Routine.findById(req.params.id)
    .then((routineDetails) => {
      res.render("user/routine-details", { routineDetails });
    })
    .catch((error) => next(error));
});

//Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
