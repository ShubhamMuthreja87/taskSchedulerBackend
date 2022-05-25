import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";
import ErrorCodes from "../../constants/errors";
import User from "../../models/User";
import Manager from "../../models/Manager";

// Checks if currently signed in user is a valid user/manager

const isUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Get the token
  const token = req.cookies.jwt;

  if (!token) return res.status(401).send(ErrorCodes.A6);
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const type = (decoded as any).userType;
    let currUser;
    if (type === "user") {
      currUser = await User.findOne({
        email: (decoded as any).email,
      })
        .select("-password -__v")
        .lean();
    } else if (type === "manager") {
      currUser = await Manager.findOne({
        email: (decoded as any).email,
      })
        .select("-password -__v")
        .lean();
    }

    if (!currUser) return res.status(401).send(ErrorCodes.A4);

    req.currentUser = {
      email: currUser.email,
      phoneNo: currUser.phoneNo,
      name: currUser.name,
      userType: currUser.userType,
      _id: currUser._id,
    } as any;
  } catch (err) {
    req.currentUser = null;
    console.error("[isAuth]", err);
    return res.status(401).send(ErrorCodes.A6);
  }

  return next();
};
export default isUserAuth;
