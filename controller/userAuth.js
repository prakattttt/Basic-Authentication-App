import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readLoginData, writeLoginData } from "../database/databaseHandler.js";

let refreshTokens = [];

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next({ status: 400, message: "All fields are required" });
    }

    const allUsers = await readLoginData();
    if (allUsers.find((u) => u.username === username)) {
      return next({ status: 400, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    allUsers.push({ username, email, password: hashedPassword });
    await writeLoginData(allUsers);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next({ status: 500, message: err.message });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const users = await readLoginData();

    const user = users.find(
      (u) => u.username === username && u.email === email
    );
    if (!user) return next({ status: 400, message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return next({ status: 400, message: "Wrong password!" });

    const authUser = { username: user.username, email: user.email };
    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);

    refreshTokens.push(refreshToken);

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (err) {
    next({ status: 500, message: err.message });
  }
};

export const getToken = (req, res, next) => {
  const { token } = req.body;
  if (!token) return next({ status: 401, message: "Refresh token required" });
  if (!refreshTokens.includes(token))
    return next({ status: 403, message: "Invalid refresh token" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return next({ status: 403, message: "Invalid refresh token" });
    const accessToken = generateAccessToken({
      username: user.username,
      email: user.email,
    });
    res.json({ accessToken });
  });
};

export const logoutUser = (req, res, next) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.json({ message: "Logged out successfully" });
};
