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
        /*User.find({trainer: dbTrainer._id}).then((specificUsers) => {
            console.log(specificUsers)
            res.render("trainer/dashboard-trainer",{ trainer: dbTrainer, user: specificUsers} )
        })*/
        res.redirect("/trainer/dashboard-trainer")
      })
      .catch((error) => next(error));
  });


//DASHBOARD TRAINER

router.get("/dashboard-trainer", (req, res, next) => {
    const loggedTrainer = req.session.currentUser
    Trainer.findById(loggedTrainer._id)
      .then((loggedTrainerData) => {
        User.find({trainer: loggedTrainer._id}).then((specificUsers) => {
            res.render("trainer/dashboard-trainer",{ 
                trainer: loggedTrainerData, 
                user: specificUsers
            })
            })
        })
        .catch((err) => next(err));
    });


//Client-details

router.get("/client-details/:id", (req, res) => {
    User.findById(req.params.id)
        .populate('routines')
      .then((clientDetails) => {
        res.render("trainer/client-details", { clientDetails });
      })
      .catch((error) => next(error));
  });





 // Create user//

 module.exports = router;