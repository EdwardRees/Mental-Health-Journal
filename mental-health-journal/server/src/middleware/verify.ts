import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export default (req: any, res: Response, next: NextFunction) => {
  if (req.headers["x-auth-token"]) {
    const token: any = req.headers["x-auth-token"];
    try {
      const secret: any = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).send({
        error: "Invalid token",
      });
    }
  }
};
