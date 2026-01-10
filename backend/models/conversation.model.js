import mongoose from "mongoose";

// Thông tin thành viên
const participantSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
})

// Thông tin nhóm
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    groupAvatarUrl: {
        type: String,
    },
    groupAvatarID: {
        type: String
    }
}, {
    _id: false
})

// Tin nhắn cuối cùng
const lastMessageSchema = new mongoose.Schema({
    _id: {type: String }, // ID của tin nhắn cuối cùng
    content: { type: String,
        default: null
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createAt: {
        type: Date,
        default: null
    }
}, {
    _id: false
})

// Cuộc hội thoại
const conversationSchema = new mongoose.Schema({
    // danh sách thành viên n-n
    type: {
        type: String,
        enum: ['direact', 'group'],
        required: true,
    },
    // Người tham gia
    participants: {
        type: [participantSchema],
        required: true,
    },
    group: {
        type: groupSchema,
    },
    lastMessageAt: { // lấy danh sách hội thoại sắp xếp theo tin nhắn cuối cùng
        type: Date,
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Hiển thị tin nhắn cuối cùng trong cuộc hội thoại
    lastMessage: {
        type: lastMessageSchema,
        default: null
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
})

participantSchema.index({
    "participants.userID": 1,
    lastMessageAt: -1
})

export default mongoose.model('Conversation', conversationSchema);