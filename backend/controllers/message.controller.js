import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import { updateConversationAfterCreateMessage } from '../utils/messageHelper.js';

// Gửi tin nhắn trực tiếp đến người dùng khác
export const sendDirectMessage = async (req, res) => {
    try {
        const { receiverID, content, conversationID } = req.body;
        const senderID = req.user._id
        
        let conversation;

        // Kiểm tra nội dụng có thiếu không
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Kiểm tra cuộc trò chuyện đã tồn tại hay chưa
        if (conversationID) {
            conversation = await Conversation.findById(conversationID);
        } else {
            conversation = await Conversation.create({
                type: 'direct',
                participants: [
                    { userID: senderID, joinedAt: new Date() },
                    { userID: receiverID, joinedAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCount: new Map()
            });
        }

        const message = await Message.create({
            conversationID: conversation._id,
            senderID,
            content
        });

        // Cập nhật cuộc trò chuyện sau khi tạo tin nhắn
        updateConversationAfterCreateMessage(conversation, message, senderID);
        await conversation.save();

        return res.status(201).json({ message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Direct message server error' });
    }
}

// Gửi tin nhắn nhóm trong cuộc trò chuyện nhóm
export const sendGroupMessage = async (req, res) => {
    try {
        const { content, conversationID } = req.body;
        const senderID = req.user._id

        // Kiểm tra nội dụng có thiếu không
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Kiem tra cuộc trò chuyện nhóm tồn tại
        const conversation = await Conversation.findById(conversationID);
        if (!conversation || conversation.type !== 'group') {
            return res.status(404).json({ message: 'Group conversation not found' });
        }

        const message = await Message.create({
            conversationID,
            senderID,
            content
        });

        // Cập nhật cuộc trò chuyện sau khi tạo tin nhắn
        updateConversationAfterCreateMessage(conversation, message, senderID);
        await conversation.save();

        return res.status(201).json({ message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Group message server error' });
    }
}