import { NextFunction, Response } from "express";

/**
 * Admin middleware
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * 
 * Used for admin only paths. Really only for testing purposes. Will be removed in production.
 */
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
  } else {
    res.status(401).send({
      error: "No token provided",
    });
  }
};
