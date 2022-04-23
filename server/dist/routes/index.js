"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const affirmation_1 = __importDefault(require("./affirmation"));
const auth_1 = __importDefault(require("./auth"));
const gratitude_1 = __importDefault(require("./gratitude"));
const mood_1 = __importDefault(require("./mood"));
const user_1 = __importDefault(require("./user"));
/**
 * Routes for the server
 */
exports.default = (app, prisma) => {
    /**
     * Routes for authentication
     */
    app.use("/api/auth", (0, auth_1.default)(prisma));
    /**
     * Routes for user profile
     */
    app.use("/api/user", (0, user_1.default)(prisma));
    /**
     * Routes for gratitude journal
     */
    app.use("/api/gratitude", (0, gratitude_1.default)(prisma));
    /**
     * Routes for affirmation
     */
    app.use("/api/affirmation", (0, affirmation_1.default)(prisma));
    /**
     * Routes for mood journal
     */
    app.use("/api/mood", (0, mood_1.default)(prisma));
};
