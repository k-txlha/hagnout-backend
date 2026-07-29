import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);

export default userRouter;
