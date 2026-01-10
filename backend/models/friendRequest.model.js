import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        maxlength: 300
    }
}, {
    timestamps: true,
})

// A chỉ gửi yêu cầu kết bạn đến B một lần
friendRequestSchema.index({from: 1, to: 1}, {unique: true})

// Truy vấn nhanh yêu cầu đã gửi từ A
friendRequestSchema.index({from: 1 })

// Truy vấn nhanh yêu cầu đã nhận bởi B
friendRequestSchema.index({to: 1 })

export default mongoose.model('FriendRequest', friendRequestSchema);