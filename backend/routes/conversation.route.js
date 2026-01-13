import express from 'express';
import { createConversation, getConversations, getMessages } from '../controllers/conversation.controller.js';
import { checkFriendShip } from '../middleware/friend.js';
const router = express.Router();

// Tạo cuộc trò chuyện mới
router.post('/', checkFriendShip, createConversation);

// Lấy danh sách cuộc trò chuyện
router.get('/', getConversations);

// Lấy danh sách tin nhắn trong cuộc trò chuyện
router.get('/:conversationID/messages', getMessages);

export default router;