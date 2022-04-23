"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("../middleware/admin"));
const verify_1 = __importDefault(require("../middleware/verify"));
/**
 * User Router
 *
 * @param prisma Prisma client to access the database
 */
const userRouter = (prisma) => {
    const router = (0, express_1.Router)();
    /**
     * @desc Check user endpoint
     * @method GET
     * @route /api/user
     * @privacy public
     */
    router.get("/", async (req, res) => {
        res.send("User Endpoint");
    });
    /**
     * @desc Get all users
     * @method GET
     * @route /api/user/all
     * @privacy private: only admins can access this endpoint
     */
    router.get("/all", [admin_1.default], async (req, res) => {
        let users = await prisma.user.findMany();
        res.send(users);
    });
    /**
     * @desc Get a user by id
     * @method POST
     * @route /api/user/:id
     * @privacy private: only a verified user can access this endpoint
     */
    router.post("/get", [verify_1.default], async (req, res) => {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({
                error: "Please provide an id",
            });
        }
        await prisma.user
            .findUnique({
            where: {
                id: parseInt(id),
            },
        })
            .then((user) => {
            res.send(user);
        });
    });
    return router;
};
exports.default = userRouter;
