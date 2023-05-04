const express = require("express");
const router = express.Router();

const Trainer = require("../models/Trainer.model");
const User = require("../models/User.model");
const Routine = require("../models/Routine.model");

module.exports = router;

// LOGIN
router.get("/login-trainer", (req, res, next) => {
    res.render("auth/login");
  });
  
router.post("/login-trainer", (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.render("/auth/login-trainer", {
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
    Trainer.findOne({ email })
      .then((dbTrainer) => {
        if (!dbTrainer) {
          res.render("auth/login", {
            errormessage: "Email is not registered. Try with other email.",
          });
          return;
        }
        const samePassword = bcryptjs.compareSync(password, dbTrainer.password);
        if (!samePassword) {
          res.render("auth/login", {
            errormessage: "Incorrect password. Please try again",
          });
          return;
        }
        res.redirect("/trainer-dashboard");
      })
      .catch((error) => next(error));
  });


//DASHBOARD TRAINER

router.get('/dashboard-trainers', (req, res, next) => {
    User.find()
      .then(allUsers => {
        res.render('trainer/dashboard-trainer.hbs', { trainer: allUsers });
      })
      .catch(error => {
        console.log('Error while getting the books from the DB: ', error);
        next(error);
      });
  });