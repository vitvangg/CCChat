// Xử lý logic chỉ nhắn tin được khi là bạn bè
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js"

const pair = (userA, userB) => {
    if (userA > userB) {
        [userA, userB] = [userB, userA];
    }
    return [userA, userB];
}

export default async function checkFriendShip(req, res, next) {
    try {
        const meID = req.user._id.toString()
        const receiverID = req.body?.receiverID ?? null

        if (!receiverID) {
            return res.status(400).json({ message: 'Receiver ID is required' })
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

    } catch (error) {
        console.error('Check friendship middleware error:', error)
        return res.status(500).json({ message: 'Check friendship middleware error' })
    }
}
