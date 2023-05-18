const userLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else if (req.session.currentUser.role === "user") {
    res.redirect("/user/user-dashboard");
  }
};

const trainerLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else if (req.session.currentUser.role === "trainer") {
    res.redirect("/trainer/dashboard-trainer");
  }
};

module.exports = { userLoggedIn, trainerLoggedIn };
