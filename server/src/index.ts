import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import routes from './routes';
const PORT = process.env.PORT || 8080;
const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/", function (req: Request, res: Response) {
  res.send("Welcome to the Mental Health Journal API");
});

routes(app, prisma);


app.listen(PORT, () => console.info(`Listening on ${PORT}`));
