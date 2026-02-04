// GET /api/messages/history?with=otherUserId&limit=20&before=2026-02-04T...
import express from 'express';
const router = express.Router();
import authMiddleware from '../middlewares/auth.middleware.js';
import { recoverMessages } from '../controllers/messages.controller.js';

router.get('/history', authMiddleware, recoverMessages);

export default router;
