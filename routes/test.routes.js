import express from "express";
const router = express.Router();
import { listCollections, createUser } from "../controllers/test.controller.js";

router.get('/list', listCollections);

router.post('/user', createUser);

export default router;