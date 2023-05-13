const userLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/user/user-dashboard");
  } else {
    next();
  }
};

// const userLoggedIn = (req, res, next) => {
//   if (req.session.currentUser.role === "user") {
//     res.redirect("/user/user-dashboard");
//   } else {
//     next();
//   }
// };

// const trainerLoggedIn = (req, res, next) => {
//   if (req.session.currentUser.role === "trainer") {
//     res.redirect("/trainer/dashboard-trainer");
//   } else {
//     next();
//   }
// };

module.exports = userLoggedIn;
