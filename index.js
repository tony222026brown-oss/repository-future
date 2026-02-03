/* server/index.js */
import express from "express";
import cors from "cors";
import http from "http";
import getDotEnv from "./manage/config_dotenv.js";
import connectApp from "./manage/connect_app.js";
import adressAllowed from "./manage/allowed_adress.js";
import routesGeneral from "./routes/general.routes.js";
import { initSocket } from "./socket.js";

// ---> Access all my environnement variables
getDotEnv();

// ----> Running server
connectApp();

const app = express();

// ----> Config all Middleware
app.use(cors({origin: (address, callback) => {
    if(!address || adressAllowed.includes(address)) {
        callback(null, true);
        console.log("✅ Access granted on your address (%s)", address);
    } else {
        callback(new Error("❌ Access refused"));
    }
}}));
app.use(express.json());

app.use('/api', routesGeneral);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Serveur + Socket.IO sur http://localhost:${PORT}`);
});