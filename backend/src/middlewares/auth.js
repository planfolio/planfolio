// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // ① Bearer 헤더 우선 → ② 쿠키
  const bearer = req.headers.authorization?.split(' ')[1];
  const token  = bearer || req.cookies.token;

  if (!token) return res.status(401).json({ message: '토큰 누락' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: '유효하지 않은 토큰' });
  }
};
