import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
})

friendSchema.path('userB').validate(function(value) {
  return value.toString() !== this.userA.toString();
}, 'User cannot friend themselves');

// pre : middleware chạy trước khi lưu dữ liệu
friendSchema.pre('save', async function() {
    const a = this.userA.toString();
    const b = this.userB.toString();

    if (a > b) {
        this.userA = new mongoose.Types.ObjectId(b);
        this.userB = new mongoose.Types.ObjectId(a);
    }
})

friendSchema.index({userA: 1, userB: 1}, {unique: true})
export default mongoose.model('Friend', friendSchema);