import "dotenv/config";
import { App } from "./app";
import { seedAdmin } from "./models/User";

const bootstrap = async () => {
  try {
    const app = new App();
    await app.start();
    await seedAdmin();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

bootstrap();