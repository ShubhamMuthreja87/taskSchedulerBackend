import bcrypt from "bcrypt";
import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../../../config";
import { cookieConfig } from "../../../constants/constants";
import ErrorCodes from "../../../constants/errors";
import Manager from "../../../models/Manager";
import { validatePhoneNoLength } from "../../../utils/validators";
import isUserAuth from "../../middlewares/isUserAuth";

const managerAuthRouter = Router();

managerAuthRouter.get("/currentUser", isUserAuth, async (req, res) => {
  if (!req.currentUser || !req.currentUser.email)
    return res.status(401).send(ErrorCodes.A5);

  const user = req.currentUser;

  return res.send({
    code: "00",
    ...user,
  });
});

managerAuthRouter.get("/managerList", isUserAuth, async (req, res) => {
  req;
  try {
		const managers = await Manager.find();
		return res.send({
			code: "00",
			managers,
		});
	} catch (err) {
		return res.status(500).send(ErrorCodes.U1);
	}
});

//signup
managerAuthRouter.post(
  "/signup",
  celebrate(
    {
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNo: Joi.number().custom(validatePhoneNoLength).required(),
        password: Joi.string().min(8).required(),
      }),
    },
    { abortEarly: false, allowUnknown: false }
  ),
  async (req, res) => {
    const { name, email, password, phoneNo } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailExists = await Manager.findOne({
      email,
    });

    if (emailExists) return res.status(409).send(ErrorCodes.A3);

    const phoneNoExists = await Manager.findOne({
      phoneNo,
    });

    if (phoneNoExists) return res.status(409).send(ErrorCodes.A5);

    const manager = await Manager.create({
      email,
      name,
      password: hashedPassword,
      phoneNo,
      userType: "manager",
    });

    const accessToken = jwt.sign(
      {
        phoneNo: manager.phoneNo,
        email,
        name: manager.name,
        userType: manager.userType,
      },
      SECRET_KEY,
      { expiresIn: "8 hours" }
    );

    res.cookie("jwt", accessToken, cookieConfig);

    return res.send({
      code: "00",
      user: {
        id: manager._id,
        email: manager.email,
        phoneNo: manager.phoneNo,
        name: manager.name,
      },
    });
  }
);

//login api
managerAuthRouter.post(
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
    const manager = await Manager.findOne({
      email: email,
    });

    if (!manager) {
      return res.status(401).send(ErrorCodes.A2);
    }
    const isCorrect = await bcrypt.compare(password, manager.password);

    if (!isCorrect) return res.status(401).send(ErrorCodes.A2);

    const accessToken = jwt.sign(
      {
        phoneNo: manager.phoneNo,
        email,
        name: manager.name,
        userType: manager.userType,
      },
      SECRET_KEY,
      { expiresIn: "8 hours" }
    );

    res.cookie("jwt", accessToken, cookieConfig);

    return res.send({
      code: "00",
      user: {
        id: manager._id,
        email: manager.email,
        phoneNo: manager.phoneNo,
        name: manager.name,
        userType: manager.userType,
      },
    });
  }
);

//logout api
managerAuthRouter.get("/logout", (_req, res) => {
  res.clearCookie("jwt", cookieConfig);
  return res.send({
    code: "00",
  });
});

export default managerAuthRouter;
