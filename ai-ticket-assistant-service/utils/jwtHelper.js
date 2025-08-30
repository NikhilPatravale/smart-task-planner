import jwt from 'jsonwebtoken';

export const signAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, email: user.email, role: user.role }, process.env.ACCESS_JWT_SECRET
  );
};

export const signRefreshToken = (jti, userId) => {
  return jwt.sign(
    { jti, sub: userId }, process.env.REFRESH_JWT_SECRET
  );
};