import express from 'express';
import { sendDirectMessage, sendGroupMessage } from '../controllers/message.controller.js';
import {checkFriendShip, checkGroupMember} from '../middleware/friend.js';

const router = express.Router();

router.post('/direct', checkFriendShip, sendDirectMessage);
router.post('/group', checkGroupMember, sendGroupMessage);

export default router;
