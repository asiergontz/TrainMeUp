const setUserRole = (req, res, next) => {
  const userRole = req.session.currentUser.role;
  res.locals.userRole = userRole;
  next();
};

module.exports = setUserRole;
