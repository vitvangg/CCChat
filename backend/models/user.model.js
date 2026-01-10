import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String
    },
    // Mật khẩu đã được mã hóa trước khi lưu
    password: { 
        type: String,
        required: true,
        select: false // không trả về password khi truy vấn
    },
    avatarUrl: {
        type: String,
    },

    // Lưu trữ ID trên cloud, có thể xóa ảnh trên cloud
    avatarID: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        sparse: true, // Cho phép giá trị null nhưng vẫn duy trì tính duy nhất nếu có giá trị
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
})

const User = mongoose.model('User', userSchema);

export default User;