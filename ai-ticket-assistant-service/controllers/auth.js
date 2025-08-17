import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign(
      {
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie('taskToken', token);

    return res.status(200).json({
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

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie('taskToken', token, {
      maxAge: 60 * 1000 * 60,
      sameSite: 'none',
      secure: true,
    });

    res.headers = {
      "Access-control-allow-origin": "http://localhost:5173",
      "Access-control-allow-credentials": true
    }

    return res.status(200).json({
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