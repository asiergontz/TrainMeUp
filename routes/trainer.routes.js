const express = require("express");
const router = express.Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const Trainer = require("../models/Trainer.model");
const User = require("../models/User.model");
const Routine = require("../models/Routine.model");



// LOGIN
router.get("/login-trainer", (req, res, next) => {
    res.render("auth/login-trainer");
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
    /*if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      res.render("auth/login-trainer", {
        errorMessage:
          "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }*/
    Trainer.findOne({ email })
      .then((dbTrainer) => {
        if (!dbTrainer) {
          res.render("auth/login-trainer", {
            errormessage: "Email is not registered. Try with other email.",
          });
          return;
        }
        /*const samePassword = bcryptjs.compareSync(password, dbTrainer.password);
        if (!samePassword) {
          res.render("auth/login", {
            errormessage: "Incorrect password. Please try again",
          });
          return;
        }*/
        req.session.currentUser = dbTrainer;
        User.find({trainer: dbTrainer._id}).then((specificUsers) => {
            console.log(specificUsers)
            res.render("trainer/dashboard-trainer",{ trainer: dbTrainer, user: specificUsers} )
        })

      })
      .catch((error) => next(error));
  });


//DASHBOARD TRAINER

/*router.get('/dashboard-trainers', (req, res, next) => {
    User.find()
      .then(allUsers => {
        res.render('trainer/dashboard-trainer.hbs', { trainer: allUsers });
      })
      .catch(error => {
        console.log('Error while getting the books from the DB: ', error);
        next(error);
      });
  }); */


 // Create user//

 router.get("/user-create", (req, res, next) => {
    res.render("trainer/user-create");
  });

  router.post("/user-create", (req, res, next) => {
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

  module.exports = router;