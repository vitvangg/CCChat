import User from "../model/user.model.js";

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
    return res.sendStatus(204)
}