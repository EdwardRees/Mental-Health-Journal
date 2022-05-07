import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Optional middleware
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * 
 * If the user is logged in, parse the decoded token and set the user.
 * If the user is not logged in, set the user to null.
 * Either way, continue.
 * 
 * This is important only for endpoints that may require an optional authentication layer. (@see /blog/:id)
 */
export default (req: any, res: Response, next: NextFunction) => {
  if (req.headers["x-auth-token"]) {
    const token: any = req.headers["x-auth-token"];
    try {
      const secret: any = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  } else {
    req.user = null;
    next();
  }
};
