const requireAuth = (req, res, next) => {
  if (!req.session.studentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export default  requireAuth;