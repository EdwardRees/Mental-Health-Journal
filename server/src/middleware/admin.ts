import { NextFunction, Response } from "express";

export default (req: any, res: Response, next: NextFunction) => {
  if (req.headers["x-admin-token"]) {
    const token: any = req.headers["x-admin-token"];
    try {
      if (token) {
        next();
      } else {
        res.status(401).send({
          error: "Unauthorized",
        });
      }
    } catch (e) {
      res.status(401).send({
        error: "Invalid token",
      });
    }
  }
};
