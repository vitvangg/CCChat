// Xử lý logic chỉ nhắn tin được khi là bạn bè
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js"

const pair = (userA, userB) => {
    if (userA > userB) {
        [userA, userB] = [userB, userA];
    }
    return [userA, userB];
}

export const checkFriendShip = async (req, res, next) => {
    try {
        const meID = req.user._id.toString()
        const receiverID = req.body?.receiverID ?? null
        const memberIDs = req.body?.memberIDs ?? []

        if (!receiverID && memberIDs.length === 0) {
            return res.status(400).json({ message: 'Receiver ID is required or member IDs are required' })
        }

        if (receiverID) {
            const [userA, userB] = pair(meID, receiverID)
            const friendship = await Friend.findOne({ userA, userB })

            if (!friendship) {
                return res.status(403).json({ message: 'You are not friends with this user' })
            }

            return next()
        }

        // logic khi chat nhóm
        // kiểm tra tình bạn với từng thành viên
        // Không tối ưu vì nhiều thành viên sẽ phải truy vấn nhiều lần
        // const friendChecks = memberIDs.map(async (memberID) => {
        //     const [userA, userB] = pair(meID, memberID)
        //     const friendship = await Friend.findOne({ userA, userB })
        //     return friendship ? null : memberID
        // })
        // const results = await Promise.all(friendChecks);
        // const notFriends = results.filter(id => id !== null)

        const friendCheck = Friend.find({
            $or: memberIDs.map(id => {
                const [userA, userB] = pair(meID, id)
                return { userA, userB }
            })
        })

        const friendIDs = friendCheck.map(f => {
            return f.userA.toString() === meID
                ? f.userB.toString()
                : f.userA.toString()
            })

        const notFriends = memberIDs.filter(
            id => !friendIDs.includes(id.toString())
        )
        if (notFriends.length > 0) {
            return res.status(403).json({ message: 'You are not friends with some users', notFriends })
        }

        next()
    } catch (error) {
        console.error('Check friendship middleware error:', error)
        return res.status(500).json({ message: 'Check friendship middleware error' })
    }
}

export const checkGroupMember = async (req, res, next) => {
    try {
        const { conversationID } = req.body
        const userID = req.user._id

        const conversation = await Conversation.findById(conversationID)
        if (!conversation) {
            return res.status(404).json({ message: 'Group conversation not found' })
        }

        const isMember = conversation.participants.some(participant => participant.userID.toString() === userID.toString())
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this group conversation' })
        }

        req.conversation = conversation

        next()
    } catch (error) {
        console.error('Check group member middleware error:', error)
        return res.status(500).json({ message: 'Check group member middleware error' })
    }
}
