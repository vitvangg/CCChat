import mongoose from "mongoose";

// Model cho message
const messageSchema = new mongoose.Schema({
    conversationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true  // Tối ưu hóa khi tìm tin nhắn theo hội thoại
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        trim: true,
    },
    imgURL: {
        type: String,
    }
}, {
    timestamps: true
})
messageSchema.index({conversationID: 1, createAt: -1})
export default mongoose.model('Message', messageSchema)