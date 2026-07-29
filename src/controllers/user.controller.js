import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AVATAR_NAMES,
  AVATAR_STYLES,
} from "../constants/avatar.constants.js";

const SALT_ROUNDS = 10;

/**
 * Handles user registration.
 * Validates uniqueness of username and email, hashes the password,
 * generates a random DiceBear avatar, and creates the user document.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const signupUser = async (req, res) => {
  const username = req.body.username;
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const randomStyle =
    AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
  const randomName =
    AVATAR_NAMES[Math.floor(Math.random() * AVATAR_NAMES.length)];
  const profilePicUrl = `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${randomName}?scale=200`;

  const existingUser = await User.findOne({ username: username });

  if (existingUser) {
    if (userEmail == existingUser.email) {
      return res
        .status(409)
        .send({ message: "Username and Email already exist!" });
    } else {
      return res.status(409).send({
        message: "Username already exist",
      });
    }
  } else {
    const existingEmail = await User.findOne({ email: userEmail });

    if (existingEmail) {
      return res.status(409).send({
        message: "Email already exist",
      });
    } else {
      bcrypt
        .hash(userPassword, SALT_ROUNDS)
        .then((hashedPassword) => {
          const user = new User({
            username: username,
            email: userEmail,
            password: hashedPassword,
            profilePic: profilePicUrl,
          });

          user
            .save()
            .then((result) => {
              res.status(201).send({
                message: "User has been created successfully!",
                result,
              });
            })
            .catch((error) => {
              res.status(500).send({
                message:
                  "Something went wrong! User could not be created!",
                error,
              });
            });
        })
        .catch((error) => {
          res.status(500).send({
            message:
              "Something went wrong! Password could not be hashed successfully!",
            error,
          });
        });
    }
  }
};

/**
 * Handles user login.
 * Verifies credentials against the database, generates a JWT token,
 * and sets it as an HTTP-only cookie.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const loginUser = async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  User.findOne({ username: username })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            console.log("wrong password");
            return res.status(400).send({
              message: "Wrong password",
            });
          }

          const accessToken = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET
          );

          res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
          });

          res.status(200).send({
            message: "Login successful",
            userId: user._id,
            profilePic: user.profilePic,
          });
        })
        .catch((error) => {
          console.log("wrong password");
          res.status(400).send({
            message: "Wrong password!!",
            error,
          });
        });
    })
    .catch((error) => {
      console.log("user not found.");
      res.status(404).send({
        message: "User not found!",
        error,
      });
    });
};

/**
 * Handles user logout by clearing the token.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const logoutUser = (req, res) => {
  res.send({ token: "" });
};
