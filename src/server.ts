import { app } from "./app";
import { envVars } from "./app/config/env";
import { connectMongoose } from "./app/lib/connectMongoose";
import { Server } from "http";
// import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await connectMongoose();
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
  }
};

(async () => {
  await startServer();
  // await seedSuperAdmin();
})();

const graceFullyShutDown = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
};

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);
  graceFullyShutDown();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");
  graceFullyShutDown();
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);
  graceFullyShutDown();
});
