import express from 'express';
import { sendDirectMessage, sendGroupMessage } from '../controllers/message.controller.js';
import friend from '../middleware/friend.js';

const router = express.Router();

router.post('/direct', friend, sendDirectMessage);
router.post('/group', friend, sendGroupMessage);

export default router;
