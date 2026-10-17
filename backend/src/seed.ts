import "dotenv/config";
import { connectDB, disconnectDB } from "./config/db";
import { seedAdmin } from "./models/User";

// Standalone seed entrypoint: `npm run seed`
// Connects, seeds the first admin from ADMIN_EMAIL/ADMIN_PASSWORD, exits.
const run = async () => {
  try {
    await connectDB();
    await seedAdmin();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

run();
