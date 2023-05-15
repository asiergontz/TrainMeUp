const express = require("express");
const router = express.Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const Routine = require("../models/Routine.model");
const Trainer = require("../models/Trainer.model");

const setUserRole = require("../middleware/userRole");
const userLoggedIn = require("../middleware/isLoggedIn");

//Log in routes
router.get("/login-user", userLoggedIn, (req, res, next) => {
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
  /*if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    res.render("auth/login-user", {
      errormessage:
        "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }*/
  User.findOne({ email })
    .then((dbUser) => {
      if (!dbUser) {
        res.render("auth/login-user", {
          errormessage: "Email is not registered. Try with other email.",
        });
        return;
      }
      /*const samePassword = bcryptjs.compareSync(password, dbUser.password);
      if (!samePassword) {
        res.render("auth/login-user", {
          errormessage: "Incorrect password. Please try again",
        });
        return;
      }*/
      req.session.currentUser = dbUser;
      res.redirect("/user/user-dashboard");
    })
    .catch((error) => next(error));
});

// DASHBOARD
router.get("/user-dashboard", setUserRole, (req, res, next) => {
  console.log(req.session.currentUser.role);
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
router.get("/data-update", setUserRole, (req, res, next) => {
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

//User routines
router.get("/user-routines", setUserRole, (req, res, next) => {
  const loggedUser = req.session.currentUser;
  User.findById(loggedUser._id)
    .then((loggedUserData) => {
      Routine.find({ user: loggedUser._id }).then((routines) => {
        res.render("user/user-routines", {
          user: loggedUserData,
          routines: routines,
        });
      });
    })
    .catch((err) => next(err));
});

//Routine details
router.get("/routine-details/:id", setUserRole, (req, res) => {
  Routine.findById(req.params.id)
    .then((routineDetails) => {
      res.render("user/routine-details", { routineDetails });
    })
    .catch((error) => next(error));
});

//Add comment

router.post("/routine-details/:id/create-comment", async (req, res, next) => {
  const { author, content } = req.body;
  const {id} = req.params
  const currentRoutine = await Routine.findById(id);
  currentRoutine.comments.push({author, content});
  console.log("Current routine", currentRoutine);
  Routine.findByIdAndUpdate(id, currentRoutine, {new:true})
    .then(() => res.redirect(`/user/routine-details/${id}`))
    .catch((err) => next(err));
});

//Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

/* Test user
User.create({
name: "test1",
email: "test1@gmail.com",
password: 1234,
phoneNumber: 1234,
biometrics: { height: 1.68, weight: 56 },
objective: "Improve Health",
});


//Test routine
Routine.create({
bodyPart: "shoulders",
day: "2",
exercises: [
{ name: "exercise1", repetitions: 2 },
{ name: "exercise2", repetitions: 4 },
],
length: "45 min",
difficulty: "Beginner",
user: "645538547b45f8e137c0d118",

//Test trainer
Trainer.create({
name: "trainer1",
email: "trainer1@gmail.com",
password: 1234,
phoneNumber: 12345,
clients: "6456182deaf77e3d4c090d94",
routines: "645618fc70c6253e54ddc25d"
})
*/
module.exports = router;
