import { readUserData, writeUserData } from "../database/databaseHandler.js";

export const getUserData = async (req, res, next) => {
  try {
    const username = req.params.username;
    if (username !== req.authUser) return next({ status: 403, message: "Access denied" });

    const users = await readUserData();
    const user = users.find((u) => u.username === username);
    if (!user) return next({ status: 404, message: "User data not found" });

    res.json(user);
  } catch (err) {
    next({ status: 500, message: err.message });
  }
};

export const postUserData = async (req, res, next) => {
  try {
    const username = req.params.username;
    if (username !== req.authUser) return next({ status: 403, message: "Access denied" });

    const users = await readUserData();
    users.push({ username, secretMsg: req.body.secretMsg });
    await writeUserData(users);

    res.status(201).json({ message: "User info saved successfully" });
  } catch (err) {
    next({ status: 500, message: err.message });
  }
};
