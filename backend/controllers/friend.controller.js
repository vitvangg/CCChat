import FriendRequest from '../models/friendRequest.model.js';
import Friend from '../models/friend.model.js'
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Gửi lời mời kết bạn
export const sendFriendRequest = async (req, res) => {
  try {
    const from = req.user._id;
    const { to, message } = req.body;

    // Kiểm tra xem có tự kết bạn với chính mình không
    if (from.toString() === to) {
      return res.status(400).json({ message: 'Cannot friend yourself' })
    }

    // Kiểm tra xem người nhận có tồn tại không
    const userExists = await User.exists({ _id: to })
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Kiểm tra xem đã gửi lời mời kết bạn chưa
    let userA = from.toString()
    let userB = to.toString()

    if (userA > userB) {
      [userA, userB] = [userB, userA]
    }

    const [alreadyFriend, existsRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from }
        ]
      })
    ])

    if (alreadyFriend) {
      return res.status(400).json({ message: 'Already friends' })
    }

    if (existsRequest) {
      return res.status(400).json({ message: 'Invite already exists' })
    }

    const request = await FriendRequest.create({ from, to, message })

    return res.status(201).json({ message: 'Friend request sent successfully', request })
  } catch (error) {
    // Lỗi bắt khi lưu dữ liệu trùng lặp
    return res.status(500).json({ message: 'Friend request server error' })
  }
}

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { request_id } = req.params
        const userID = req.user._id
        // Kiểm tra đã có yêu cầu kết bạn hay chưa
        const request = await FriendRequest.findById(request_id)
        // console.log(request)
        if (!request) {
            return res.status(404).json({ message: 'Friend request not found' })
        }

        // Chỉ người nhận mới có thể chấp nhận lời mời
        if (request.to.toString() !== userID.toString()) {
            return res.status(403).json({ message: 'Not authorized to accept this friend request' })
        }

        // Tạo bạn bè
        await Friend.create([{ userA: request.from, userB: request.to }], { session })
        // Xóa lời mời kết bạn
        await FriendRequest.deleteOne({ _id: request._id }, { session })

        await session.commitTransaction()

        const from = await User.findById(request.from).select('_id displayName avatarURL').lean()

        return res.status(201).json({ message: 'New Friendship created', newFriend: {
            _id: from?._id,
            displayName: from?.displayName,
            avatarURL: from?.avatarURL
        }})
    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return res.status(500).json({ message: 'Accept Friend request server error' })
    } finally {
        session.endSession()
    }
}

// Từ chối lời mời kết bạn
export const declineFriendRequest = async (req, res) => {
  try {
    const { request_id } = req.params
    const user = req.user

    // Kiểm tra đã có yêu cầu kết bạn hay chưa
    const request = await FriendRequest.findById(request_id)
    if (!request) {
        return res.status(404).json({ message: 'Friend request not found' })
    }

    // Chỉ người nhận mới có thể từ chối lời mời
    if (request.to.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to decline this friend request' })
    }

    await FriendRequest.findByIdAndDelete(request_id)

    return res.status(204).json({ message: 'Friend request declined' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Friend request server error' })
  }
}

// Lấy danh sách bạn bè 
export const getAllFriends = async (req, res) => {
  try {
    const userID = req.user._id
    const friendShip = await Friend.find({
      $or: [
        { userA: userID },
        { userB: userID }
      ]
    }).populate("userA", "_id displayName avatarURL").populate("userB", "_id displayName avatarURL")

    if (!friendShip.length === 0) {
      return res.status(200).json({ friends: [] })
    }

    const friends = friendShip.map((f) => {
      return f.userA._id.toString() === userID.toString() ? f.userB : f.userA
    })

    return res.status(200).json({ friends })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Friend list server error' })
  }
}

// Lấy danh sách lời mời kết bạn
export const getAllRequests = async (req, res) => {
  try {
    const userId = req.user._id

    const populateField = "_id displayName avatarURL"

    const [sent, received] = await Promise.all([
      await FriendRequest.find({ from: userId}).populate("to", populateField).lean(),
      await FriendRequest.find({ to: userId}).populate("from", populateField).lean(),
    ])

    return res.status(200).json({ sent, received })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Friend request list server error' })
  }
} 