import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { connectDB, disconnectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import { categoryRouter } from "./routes/categories";
import { productRouter } from "./routes/products";
import { orderRouter } from "./routes/orders";
import { reviewRouter } from "./routes/reviews";
import { miscRouter } from "./routes/misc";
import { ApiError } from "./utils/ApiError";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
    this.errorHandler();
  }

  private middleware() {
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(
      cors({
        origin: env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(cookieParser());

    // Rate limiting
    const authLimiter = rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many requests, please try again later",
    });
    this.app.use("/api/v1/auth", authLimiter);

    // Stricter limits on spam/abuse-prone endpoints
    const strictLimiter = rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: Math.min(env.RATE_LIMIT_MAX, 30),
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many requests, please try again later",
    });
    this.app.use("/api/v1/reviews", strictLimiter);
    this.app.use("/api/v1/images", strictLimiter);
    this.app.use("/api/v1/subscribe", strictLimiter);
  }

  private routes() {
    this.app.get("/health", (_req: Request, res: Response) => {
      res.json({ status: "ok", service: "bukky-collection-api", timestamp: new Date().toISOString() });
    });

    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/categories", categoryRouter);
    this.app.use("/api/v1/products", productRouter);
    this.app.use("/api/v1/orders", orderRouter);
    this.app.use("/api/v1/reviews", reviewRouter);
    this.app.use("/api/v1", miscRouter);

    // 404
    this.app.use("*", (_req: Request, res: Response) => {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
    });
  }

  private errorHandler() {
    this.app.use(errorHandler);
  }

  async start() {
    await connectDB();
    return new Promise<number>((resolve) => {
      const server = this.app.listen(env.PORT, () => {
        console.log(`API running on http://localhost:${env.PORT}`);
        resolve(env.PORT);
      });
      // Graceful shutdown
      const shutdown = async () => {
        console.log("Shutting down...");
        server.close(async () => {
          await disconnectDB();
          process.exit(0);
        });
      };
      process.on("SIGTERM", shutdown);
      process.on("SIGINT", shutdown);
    });
  }
}