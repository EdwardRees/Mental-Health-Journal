"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Prisma client used for connecting to the database
 *
 * @param prisma Prisma Client
 */
const authRouter = (prisma) => {
    const router = (0, express_1.Router)();
    /**
     * @desc Check auth endpoint
     * @method GET
     * @route /api/auth
     * @privacy public
     */
    router.get("/", (req, res) => {
        res.send("Authentication route");
    });
    /**
     * @desc Register a user
     * @method POST
     * @route /api/auth/register
     * @privacy public
     */
    router.post("/register", async (req, res) => {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).send({
                error: "Please provide an email, password, and username",
            });
        }
        // encrypt password with bcrypt
        let hash = bcrypt_1.default.hashSync(password, 10);
        await prisma.user
            .create({
            data: {
                auth: {
                    create: {
                        username: username,
                        email: email,
                        password: hash,
                    },
                },
                gratitudeEntries: {
                    create: [],
                },
                affirmationEntries: {
                    create: [],
                },
                moodEntries: {
                    create: [],
                },
            },
        })
            .then((user) => {
            const accessToken = process.env.ACCESS_TOKEN_SECRET;
            // jwt sign user
            const token = jsonwebtoken_1.default.sign({ user }, accessToken);
            res.send({ user, token });
        });
    });
    /**
     * @desc Login a user
     * @method POST
     * @route /api/auth/login
     * @privacy public
     */
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                error: "Please provide an email and password",
            });
        }
        await prisma.auth
            .findUnique({
            where: {
                email: email,
            },
        })
            .then((user) => {
            if (!user) {
                return res.status(400).send({
                    error: "User does not exist",
                });
            }
            // compare password with hash
            const validPassword = bcrypt_1.default.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).send({
                    error: "Invalid password",
                });
            }
            const accessToken = process.env.ACCESS_TOKEN_SECRET;
            // jwt sign user
            const token = jsonwebtoken_1.default.sign({ user }, accessToken);
            res.send({ user, token });
        });
    });
    return router;
};
exports.default = authRouter;
