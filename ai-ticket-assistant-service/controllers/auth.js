import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { inngest } from "../inngest/client.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';
import { signAccessToken, signRefreshToken } from '../utils/jwtHelper.js';

export const SignUp = async (req, res) => {
  const { email, password, skills = [], role } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      password: hashedPass,
      skills,
      role
    });

    const plainUserObject = newUser.toObject();
    delete plainUserObject.password;

    if (!newUser) {
      res.status(401).json({
        error: 'Signup failed',
      });
    }

    await inngest.send({
      name: 'user/signup',
      data: {
        email: newUser.email,
      }
    });

    const jti = uuidV4();

    const refreshToken = signRefreshToken(jti, plainUserObject);

    await RefreshToken.create({
      jti,
      userId: newUser._id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      revoked: false,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
      secure: process.env.NODE_ENV == 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const csrfToken = uuidV4();

    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
      secure: process.env.NODE_ENV == 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = signAccessToken(newUser);

    return res.status(200).json({
      accessToken,
      user: {
        email: newUser.email,
        role: newUser.role,
        skills: newUser.skills,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Signup failed',
      details: error.message,
    });
  }
};

export const LogIn = async (req, res) => {
  console.log("Login Controller:", req.body);

  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      })
    };

    const { password: hashedPass } = user;
    const isPasswordMatching = await bcrypt.compare(password, hashedPass);

    if (!isPasswordMatching) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    const jti = uuidV4();

    const plainUserObject = user.toObject();
    delete plainUserObject.password;

    const refreshToken = signRefreshToken(jti, plainUserObject);

    await RefreshToken.create({
      jti,
      userId: user._id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      revoked: false
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
      secure: process.env.NODE_ENV == 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const csrfToken = uuidV4();

    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
      secure: process.env.NODE_ENV == 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = signAccessToken(user);

    return res.status(200).json({
      accessToken,
      user: {
        email: user.email,
        role: user.role,
        skills: user.skills,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'LogIn failed',
      details: error.message,
    });
  }
};

export const Refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({
    message: "No refresh token",
  });

  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const storedEntry = await RefreshToken.findOne({ jti: payload.jti, userId: payload.sub._id });

  const user = await UserModel.findById(payload.sub._id).select("-password");

  if (!storedEntry || storedEntry.revoked || !user) {
    await RefreshToken.updateMany({ userId: payload.sub._id }, { revoked: true });
    return res.status(401).json({
      message: "Refresh token revoked"
    });
  }

  const newJti = uuidV4();
  const plainUserObject = user.toObject();
  delete plainUserObject.password;

  const newRefreshToken = signRefreshToken(newJti, plainUserObject);

  await RefreshToken.create({
    jti: newJti,
    userId: user._id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    revoked: false
  });

  await RefreshToken.updateOne({
    jti: payload.jti,
    revoked: true,
  }, {
    replacedBy: newJti
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
    secure: process.env.NODE_ENV == 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const csrfToken = uuidV4();

  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: false,
    sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
    secure: process.env.NODE_ENV == 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const accessToken = signAccessToken(user);

  return res.status(200).json({
    accessToken
  });
};

export const LogOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        await RefreshToken.updateOne({ jti: payload.jti, userId: payload.sub._id }, { revoked: true });
      } catch (e) { }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
      secure: process.env.NODE_ENV == 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.clearCookie('XSRF-TOKEN', {
      httpOnly: false,
      sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'strict',
      secure: process.env.NODE_ENV == 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    res.status(500).json({
      error: 'Logout failed',
      details: error.message,
    });
  }
};