// routes/account.js
import express from "express";
const router = express.Router();
import { getAccount } from "../controllers/account.controller.js";

router.get("/search", getAccount);

export default router;
