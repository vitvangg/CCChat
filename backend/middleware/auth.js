import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'

export default async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access token missing or invalid' })
        }
        const access_token = authHeader.split(' ')[1]

        if (!access_token) {
            return res.status(401).json({message: "Token not right"})
        }
        console.log(process.env.JWT_SECRET)
        const decoded = jwt.verify(access_token, process.env.JWT_SECRET)

        const user = await User.findById({
            _id: decoded.userID
        })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // trả user về requit
        req.user = user
        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}