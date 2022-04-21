"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = __importDefault(require("../middleware/verify"));
/**
 * Router to handle Gratitude journal components
 * @param prisma Prisma Client to access database
 */
const gratitudeRouter = (prisma) => {
    const router = (0, express_1.Router)();
    /**
     * Get all gratitude entries
     */
    router.get("/", async (req, res) => {
        let gratitudeEntries = await prisma.gratitudeEntry.findMany();
        res.send(gratitudeEntries);
    });
    /**
     * Create a gratitude entry for a user id
     */
    router.post("/create/:userId", [verify_1.default], async (req, res) => {
        const { userId } = req.params;
        const { gratitude, date } = req.body;
        if (!userId || !gratitude || !date) {
            return res.status(400).send({
                error: "Please provide a userId, gratitude, and date",
            });
        }
        await prisma.gratitudeEntry
            .create({
            data: {
                user: {
                    connect: {
                        id: parseInt(userId),
                    },
                },
                gratitude: gratitude,
                date: date,
            },
        })
            .then((gratitudeEntry) => {
            res.send(gratitudeEntry);
        })
            .catch((err) => res.status(500).send(err));
    });
    /**
     * Get gratitude entries for user by id
     */
    router.get("/user/:userId", [verify_1.default], async (req, res) => {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).send({
                error: "Please provide a userId",
            });
        }
        await prisma.gratitudeEntry
            .findMany({
            where: {
                user: {
                    id: parseInt(userId),
                },
            },
        })
            .then((gratitudeEntries) => {
            res.send(gratitudeEntries);
        })
            .catch((err) => res.status(500).send(err));
    });
    /**
     * Get gratitude entry by id
     */
    router.get("/get/:id", [verify_1.default], async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({
                error: "Please provide an id",
            });
        }
        await prisma.gratitudeEntry
            .findUnique({
            where: {
                id: parseInt(id),
            },
        })
            .then((gratitudeEntry) => {
            res.send(gratitudeEntry);
        })
            .catch((err) => res.status(500).send(err));
    });
    /**
     * Update a gratitude entry
     */
    router.put("/update/:userId/:gratitudeId", [verify_1.default], async (req, res) => {
        const { userId, gratitudeId } = req.params;
        const { gratitude, date } = req.body;
        if (!userId || !gratitude || !date) {
            return res.status(400).send({
                error: "Please provide a userId, gratitude, and date",
            });
        }
        await prisma.gratitudeEntry
            .update({
            where: {
                id: parseInt(gratitudeId),
            },
            data: {
                user: {
                    connect: {
                        id: parseInt(userId),
                    },
                },
                gratitude: gratitude,
                date: date,
            },
        })
            .then((gratitudeEntry) => {
            res.send(gratitudeEntry);
        })
            .catch((err) => res.status(500).send(err));
    });
    return router;
};
exports.default = gratitudeRouter;
