import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        error: "Access denied, invalid or expired token"
      })
    }

    const tokenPayload = jwt.verify(token, process.env.REFRESH_JWT_SECRET);

    req.user = tokenPayload;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Access denied"
    })
  }
};