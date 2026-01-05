import User from "../model/user.model.js";
import Session from "../model/session.model.js";

export async function getUserProfile(req, res) {
    try {
        const user = req.user
        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.error('Error getting user profile:', error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
} 

export async function test(req, res) {
    const indexes = await Session.collection.getIndexes()
    console.log(indexes)
    return res.sendStatus(204)
}