"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const routes_1 = __importDefault(require("./routes"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api/", function (req, res) {
    res.send("Welcome to the Mental Health Journal API");
});
(0, routes_1.default)(app, prisma);
app.listen(PORT, () => console.info(`Listening on ${PORT}`));
