import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

// Tạo cuộc trò chuyện mới
export const createConversation = async (req, res) => {
    try {
        const { type, name, memberIDs } = req.body
        const userID = req.user._id

        // Kiểm tra nếu là cuộc trò chuyện nhóm
        if (!type || (type === 'group' && !name || !memberIDs || !Array.isArray(memberIDs) || memberIDs.length === 0)) {
            return res.status(400).json({ message: 'Name group and member IDs are required' })
        }

        // Biến lưu cuộc trò chuyện
        let conversation;

        // Xử lý chat trực tiếp
        if (type === "direct") {
            // Cuộc trò chuyện trực tiếp giữa hai người
            const participantID = memberIDs[0]

            // Kiểm tra nếu cuộc trò chuyện đã tồn tại
            conversation = await Conversation.findOne({
                type: 'direct',
                "participants.userID": { $all: [userID, participantID] },
            })

            if (!conversation) {
                // Tạo cuộc trò chuyện mới
                conversation = new Conversation({
                    type: 'direct',
                    participants: [
                        { userID: userID, joinedAt: new Date() },
                        { userID: participantID, joinedAt: new Date() }
                    ],
                    lastMessageAt: new Date(),
                })
                await conversation.save()
            }
        }
        // Xử lý chat nhóm
        if (type === "group") {
            conversation = new Conversation({
                type: 'group',
                participants: [
                    { userID: userID, joinedAt: new Date() },
                    ...memberIDs.map(id => ({ userID: id, joinedAt: new Date() }))
                ],
                group: {
                    name: name,
                    createdBy: userID,
                },
                lastMessageAt: new Date(),
            })
            await conversation.save()
        }

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation type is not valid' })
        }

        await conversation.populate([
            {path: 'participants.userID', select: 'displayName avatarURL'},
            {path: 'seenBy', select: 'displayName avatarURL'},
            {path: 'lastMessage.senderID', select: 'displayName avatarURL'},
        ])
        return res.status(201).json(conversation)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Conversation creation server error' })
    }
}


export const getConversations = async (req, res) => {
    try {
        const userID = req.user._id

        const conversations = await Conversation.find({
            "participants.userID": userID
        })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .populate([
            { path: 'participants.userID', select: 'displayName avatarURL' },
            { path: 'seenBy', select: 'displayName avatarURL' },
            { path: 'lastMessage.senderID', select: 'displayName avatarURL' },
        ])

        const formatted = conversations.map(conv => {
            const participants = (conv.participants || []).map(p => ({
                _id: p.userID?._id,
                displayName: p.userID?.displayName,
                avatarURL: p.userID?.avatarURL ?? null,
                joinedAt: p.joinedAt,
            }))
            return {
                ...conv.toObject(),
                unreadCount: conv.unreadCount || {},
                participants,
            }
        })

        return res.status(200).json({ conversations: formatted })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Get conversations server error' })
    }
}

export const getMessages = async (req, res) => {
    try {
        const conversationID = req.params.conversationID
        const { limit = 50, cusor } = req.query

        const query = { conversationID }
        if (cusor) {
            query.createdAt = { $lt: new Date(cusor) }
        }

        let messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) + 1)

        let nextCursor = null
        if (messages.length > Number(limit)) {
            const nextMessage = messages.pop()
            nextCursor = nextMessage.createdAt.toISOString()
        }

        messages.reverse()
        
        return res.status(200).json({ messages, nextCursor })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Get messages server error' })
    }
}