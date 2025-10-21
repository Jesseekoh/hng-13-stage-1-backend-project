import express from "express";
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import rateLimit from "express-rate-limit";
import cors from "cors";
import stringRoutes from "./routes/string.routes";
import { pinoHttp } from "pino-http";
import logger from "./utils/logger";
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// app.use(pinoHttp({ logger }));

app.use(limiter);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/strings", stringRoutes);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(err, "Error occurred");
  if (err instanceof ZodError) {
    res.status(422).json({
      message: 'Invalid data type for "value" (must be string)',
    });
  } else {
    res.status(500).send("Something broke!");
  }
});

export default app;
