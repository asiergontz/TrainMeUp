const express = require("express");
const router = express.Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const Trainer = require("../models/Trainer.model");
const User = require("../models/User.model");
const Routine = require("../models/Routine.model");

const setUserRole = require("../middleware/userRole");
const { userLoggedIn, trainerLoggedIn } = require("../middleware/isLoggedIn");

//------------LOGIN----------//
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
      res.redirect("/trainer/dashboard-trainer");
    })
    .catch((error) => next(error));
});

//----------DASHBOARD TRAINER--------//

router.get("/dashboard-trainer", setUserRole, (req, res, next) => {
  const loggedTrainer = req.session.currentUser;
  Trainer.findById(loggedTrainer._id)
    .then((loggedTrainerData) => {
      User.find({ trainer: loggedTrainer._id }).then((specificUsers) => {
        res.render("trainer/dashboard-trainer", {
          trainer: loggedTrainerData,
          user: specificUsers,
        });
      });
    })
    .catch((err) => next(err));
});

//---------CLIENT-DETAILS-----------//

router.get("/client-details/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(req.params.id)
    .then((clientDetails) => {
      Routine.find({ user: id }).then((userRoutines) => {
        res.render("trainer/client-details", {
          routines: userRoutines,
          user: clientDetails,
        });
      });
    })
    .catch((error) => next(error));
});

//delete routine//

router.post("/routine-client/:id/delete", (req, res, next) => {
  const { id } = req.params;
  Routine.findByIdAndDelete(id)
    .then(() => res.redirect("/"))
    .catch((error) => next(error));
});

//add routine//

router.get("/client-details/:id/routine-new", setUserRole, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((userData) => {
      res.render("trainer/routine-new", { userData });
    })
    .catch((err) => next(err));
});

router.post("/routine-new", (req, res, next) => {
  const loggedTrainer = req.session.currentUser;
  const { routineName,bodyPart, day, length, difficulty, _id } = req.body;
  const exercises = [];
  req.body["exercises[name][]"].forEach((name, index) => {
    const repetitions = req.body["exercises[repetitions][]"][index];
    exercises.push({ name, repetitions });
  });
  Routine.create({
    routineName,
    trainer: loggedTrainer,
    bodyPart,
    day,
    exercises,
    length,
    difficulty,
    user: _id,
  })
    .then(() => {
      res.redirect(`/trainer/client-details/${_id}`);
    })
    .catch((err) => next(err));
});

//----------CLIENT-ROUTINE DETAILS-----------//

router.get("/routine-client/:id", (req, res) => {
  Routine.findById(req.params.id)
    .then((routineDetails) => {
      res.render("trainer/routine-client", { routineDetails });
    })
    .catch((error) => next(error));
});

//edit routine//

router.get("/routine-client/:id/edit", setUserRole, (req, res, next) => {
  const { id } = req.params;
  Routine.findById(id)
    .then((routineToEdit) => {
      res.render("trainer/routine-edit.hbs", { routineToEdit });
    })
    .catch((error) => next(error));
});

router.post("/routine-edit/:id", (req, res, next) => {
  const routineId = req.params.id;
  const { routineName, bodyPart, day, length, difficulty } = req.body;
  const exercises = [];
  req.body["exercises[name][]"].forEach((name, index) => {
    const repetitions = req.body["exercises[repetitions][]"][index];
    exercises.push({ name, repetitions });
  });
  Routine.findByIdAndUpdate(
    req.params.id,
    { routineName, bodyPart, day, length, exercises, difficulty },
    { new: true }
  )
    .then(() => res.redirect(`/trainer/routine-client/${routineId}`))
    .catch((err) => next(err));
});


  
//Add a comment


router.post("/routine-client/:id/create-comment", async (req, res, next) => {
  const { comments } = req.body;
  const currentRoutine = await Routine.findById(req.params.id);
  currentRoutine.comments.push(comments);
  console.log("Current routine", currentRoutine);
  Routine.findByIdAndUpdate(req.params.id, currentRoutine, { new: true })
    .then(() => res.redirect(`trainer/routine-client/${req.params.id}`))
    .catch((err) => next(err));
});

router.post('trainer/routine-client/:id/create-comment', (req, res, next) => {
            const loggedTrainer = req.session.currentUser;
            const { bodyPart, day, length, difficulty, _id } = req.body;
            const comments = [];
            req.body["comments[author][]"].forEach((author, index) => {
              const content = req.body["comments[content][]"][index];
              exercises.push({ author, content });
            });
          
            Routine.create({
              trainer: loggedTrainer,
              bodyPart,
              day,
              exercises,
              length,
              difficulty,
              user: _id,
            })
              .then(() => {
                res.redirect(`/trainer/client-details/${_id}`);
              })
              .catch((err) => next(err));
          });
//----------CLIENT REGISTRATION---------//

router.get("/client-registration", setUserRole, (req, res, next) => {
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

//--------SIGN UP TRAINERS---------//
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
