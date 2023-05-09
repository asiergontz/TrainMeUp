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


//CLIENT-DETAILS//

router.get("/client-details/:id", (req, res) => {
    User.findById(req.params.id)
        .populate('routines')
      .then((clientDetails) => {
        res.render("trainer/client-details", { clientDetails });
      })
      .catch((error) => next(error));
  });

  //delete routine//

  router.post('/client-details/:id/delete', (req, res, next) => {
    const { routineId } = req.params.id;
    Routine.findByIdAndDelete(routineId)
        .populate('routines')
      .then(() => res.render('trainer/client-details/:id'))
      .catch(error => next(error));
  });


//CLIENT-ROUTINE DETAILS//

router.get("/routine-client/:id", (req, res) => {
    Routine.findById(req.params.id)
      .then((routineDetails) => {
        res.render("trainer/routine-client", { routineDetails });
      })
      .catch((error) => next(error));
  });

  //edit routine//

  router.get('/routine-client/:Id/edit', (req, res, next) => {
    const { routineId } = req.params;
   
    Routine.findById(routineId)
      .then(routineToEdit => {
        res.render('trainer/routine-edit.hbs', { routine: routineToEdit });
      })
      
      .catch(error => next(error));
  });

  router.post('/routine-client/:Id/edit', (req, res, next) => {
    const {routineId} = req.params
    const { bodyPart, day, exercise, length, difficulty } = req.body

    Routine.findByIdAndUpdate (routineId, {bodyPart, day, exercise, length, difficulty}, {new:true})
    .then( updatedRoutine => res.redirect('/routine-client/ ${updatedRoutine.id}'))
    .catch((err) => next(err))
  })



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
    /*if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      res.render("auth/signup-trainer", {
        errorMessage:
          "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }*/
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

 module.exports = router;