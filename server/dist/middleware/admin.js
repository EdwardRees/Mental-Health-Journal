"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    if (req.headers["x-admin-token"]) {
        const token = req.headers["x-admin-token"];
        try {
            if (token) {
                next();
            }
            else {
                res.status(401).send({
                    error: "Unauthorized",
                });
            }
        }
        catch (e) {
            res.status(401).send({
                error: "Invalid token",
            });
        }
    }
};
