import http from "http"
import app from "./app.js"
import env from './shared/config/dotenv.js'
import prisma from "./lib/db.js"

const server = http.createServer(app)
const port = Number(env.PORT)

server.listen(port, () => {
  console.log("server started")
})

let shuttingDown = false

const shutdown = async (signal: string) => {
  if (shuttingDown) {
    return
  }

  console.log(`${signal} received. Shutting down...`);

  server.close(async (err) => {
    if (err) {
      console.error("Error closing server:", err);
      process.exitCode = 1;
    }
    
    try {
      await prisma.$disconnect();
      console.log("Database disconnected");
      shuttingDown = true
    } catch (error) {
      console.error("Error disconnecting database:", error);
      process.exitCode = 1;
    }
  })
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))