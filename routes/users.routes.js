import express from "express";
const router = express.Router();
import { getUsers } from "../controllers/users.controller.js";
import { login } from "../controllers/login.controller.js";

router.get("/getuser", getUsers);

router.post("/login", login);

export default router;
