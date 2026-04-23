/* server/index.js */
import express from "express";
import cors from "cors";
import http from "http";
import getDotEnv from "./manage/config_dotenv.js";
import connectApp from "./manage/connect_app.js";
import adressAllowed from "./manage/allowed_adress.js";
import routesGeneral from "./routes/general.routes.js";
import { initSocket } from "./socket/socket.js";
import main from "./script/seed.js";

// ---> Access all my environnement variables
getDotEnv();

async function startServer() {
    try {
      await connectApp(); // ✅ attendre Mongo
  
      const app = express();
  
      app.use(cors({
        origin: (address, callback) => {
          if (!address || adressAllowed.includes(address)) {
            callback(null, true);
            console.log("✅ Access granted (%s)", address);
          } else {
            callback(new Error("❌ Access refused"));
          }
        }
      }));
  
      app.use(express.json());
      app.use('/api', routesGeneral);
  
      const server = http.createServer(app);
      initSocket(server);
  
      // ✅ lancer seed APRÈS Mongo
      // await main();
  
      const PORT = process.env.PORT || 3000;

      console.log("🔥🔥🔥 NEW VERSION LOADED 🔥🔥🔥");
      
      server.listen(PORT, () => {
        console.log(`🚀 Serveur sur http://localhost:${PORT}`);
      });
  
    } catch (error) {
      console.error("❌ Server start error:", error);
    }
  }
  
  startServer();