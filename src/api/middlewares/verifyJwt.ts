import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";
import ErrorCodes from "../../constants/errors";
import Customer from "../../models/Customer";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Get the jwt token from cookie
    const token = req.cookies.jwt;

    // No token exists, return 401
    if (!token) return res.status(401).send(ErrorCodes.A4);

    // Decode the token using SECRET_KEY
    const decoded = jwt.verify(token, SECRET_KEY);

    const email = (decoded as any).email;

    const user = await Customer.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).send(ErrorCodes.A6);
    } else {
      return next();
    }
  } catch (err) {
    return res.status(401).send(ErrorCodes.A4);
  }
};
