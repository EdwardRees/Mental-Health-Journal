"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = __importDefault(require("../middleware/verify"));
const moodRouter = (prisma) => {
    const router = (0, express_1.Router)();
    router.get("/", async (req, res) => {
        let moodEntries = await prisma.moodEntry.findMany();
        res.send(moodEntries);
    });
    /**
     * @route GET /mood/:id Get mood entry by id
     */
    router.post("/create/:userId", [verify_1.default], async (req, res) => {
        const { userId } = req.params;
        const { mood, date, emotions, moodScore } = req.body;
        if (!userId || !mood || !date) {
            return res.status(400).send({
                error: "Please provide a userId, mood, and date",
            });
        }
        await prisma.moodEntry
            .create({
            data: {
                user: {
                    connect: {
                        id: parseInt(userId),
                    },
                },
                mood: mood,
                date: date,
                emotions: emotions.split(","),
                moodScore: parseInt(moodScore),
            },
        })
            .then((moodEntry) => {
            res.send(moodEntry);
        })
            .catch((err) => res.status(500).send(err));
    });
    /**
     * @route PUT api/mood/update/:id
     */
    router.put("/update/:id", [verify_1.default], async (req, res) => {
        const { id } = req.params;
        const { mood, date, emotions, moodScore } = req.body;
        if (!id || !mood || !date) {
            return res.status(400).send({
                error: "Please provide an id, mood, and date",
            });
        }
        await prisma.moodEntry
            .update({
            where: {
                id: parseInt(id),
            },
            data: {
                mood: mood,
                date: date,
                emotions: emotions.split(","),
                moodScore: parseInt(moodScore),
            },
        })
            .then((moodEntry) => {
            res.send(moodEntry);
        })
            .catch((err) => res.status(500).send(err));
    });
    return router;
};
exports.default = moodRouter;
