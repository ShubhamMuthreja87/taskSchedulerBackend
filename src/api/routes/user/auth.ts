import bcrypt from "bcrypt";
import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../../../config";
import { cookieConfig } from "../../../constants/constants";
import ErrorCodes from "../../../constants/errors";
import User from "../../../models/User";
import { validatePhoneNoLength } from "../../../utils/validators";
import isUserAuth from "../../middlewares/isUserAuth";


const userAuthRouter = Router();

userAuthRouter.get("/currentUser", isUserAuth, async (req, res) => {
  if (!req.currentUser || !req.currentUser.email)
    return res.status(401).send(ErrorCodes.A5);

  const user = req.currentUser;

  return res.send({
    code: "00",
    ...user,
  });
});

//signup
userAuthRouter.post(
  "/signup",
  celebrate(
    {
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNo: Joi.number().custom(validatePhoneNoLength).required(),
        password: Joi.string().min(8).required(),
        managerId: Joi.string().required(),
        workHrs:Joi.number().required(),
      }),
    },
    { abortEarly: false, allowUnknown: false }
  ),
  async (req, res) => {
    const {
      name,
      email,
      password,
      phoneNo,
      managerId,
      workHrs
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailExists = await User.findOne({
      email,
    });

    if (emailExists) return res.status(409).send(ErrorCodes.A3);

    const phoneNoExists = await User.findOne({
      phoneNo,
    });

    if (phoneNoExists) return res.status(409).send(ErrorCodes.A5);


    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      phoneNo,
      managerId,
      workHrs,
      userType: "user",
      isApproved: false
    });

    const accessToken = jwt.sign(
      {
        phoneNo: user.phoneNo,
        email,
        name: user.name,
        userType: user.userType
      },
      SECRET_KEY,
      { expiresIn: "8 hours" }
    );

    res.cookie("jwt", accessToken, cookieConfig);

    return res.send({
      code: "00",
      user: {
        email: user.email,
        phoneNo: user.phoneNo,
        name: user.name,
        id:user._id
      },
    });
  }
);

//login api
userAuthRouter.post(
  "/login",
  celebrate(
    {
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    },
    { abortEarly: false, allowUnknown: false }
  ),
  async (req, res) => {
    const { email, password } = req.body;
   
    const user = await User.findOne({
      email: email,
    });

    if (!user){
      return res.status(401).send(ErrorCodes.A2);
    }
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) return res.status(401).send(ErrorCodes.A2);

    const accessToken = jwt.sign(
      {
        phoneNo: user.phoneNo,
        email,
        name: user.name,
        userType: user.userType
      },
      SECRET_KEY,
      { expiresIn: "8 hours" }
    );

    res.cookie("jwt", accessToken, cookieConfig);

    return res.send({
      code: "00",
      user: {
        email: user.email,
        phoneNo: user.phoneNo,
        name: user.name,
        managerId :user.managerId,
        userType :user.userType,
        id:user._id
      },
    });
  }
);

//logout api
userAuthRouter.get("/logout", (_req, res) => {
  res.clearCookie("jwt", cookieConfig);
  return res.send({
    code: "00",
  });
});



export default userAuthRouter;
