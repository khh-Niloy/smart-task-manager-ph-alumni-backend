import express from "express";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes";
import cors from "cors";
export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Smart Task Manager Backend");
});
