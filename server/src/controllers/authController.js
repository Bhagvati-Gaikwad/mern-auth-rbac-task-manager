import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";

const buildAuthResponse = (user) => ({
  token: signToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

export const register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: buildAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+password");

    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    res.json({
      success: true,
      message: "Login successful",
      data: buildAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
};
