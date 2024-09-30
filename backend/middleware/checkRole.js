const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userData.role;
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({
        message: "Akses ditolak",
        err: null,
      });
    }
  };
};

module.exports = { checkRole };