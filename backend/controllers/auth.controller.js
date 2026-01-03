import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto"
import Session from "../model/session.model.js";
import User from "../model/user.model.js";

const ACCESS_TOKEN_TTL = '30s'
const REFRESH_TOKEN_TTL = 2 * 60 * 1000 // 2 phút

export async function signUp(req, res) {
    try {
        const {email, password,  displayName} = req.body

        // kiem tra ton tai
        if (!email || !password || !displayName) {
            return res.status(400).json({message: 'Missing required fields'})
        }

        // kiểm tra email đã tồn tại
        const duplicate = await User.findOne({
            email: email.toLowerCase()
        })

        if (duplicate) {
            return res.status(400).json({message: 'Email already exists'})
        }

        // mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10)

        // tạo user
        const new_user = await User.create({
            email, 
            password: hashedPassword,
            displayName
        })

        return res.status(201).json({message: `Welcome ${new_user.displayName}`})

    } catch (error) {
        console.error(error)
        return res.status(500).json({message: 'Internal server error'})
    }
}

export async function signIn(req, res) {
    try {
        const { email,  password } = req.body

        if (!email || !password) {
            return res.status(400).json({message: "Missing required fields"})
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        }).select('+password')

        if (!user) {
            return res.status(404).json({message: "User not found"})
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(409).json({message: "Password wrong"})
        } 

        const access_token = jwt.sign(
            {
                userID: user._id  // dữ liệu lưu trong token
            },
            process.env.JWT_SECRET,
            {
                expiresIn: ACCESS_TOKEN_TTL
            }
        )

        // tạo refresh token từ crypto
        const refresh_token = crypto.randomBytes(64).toString('hex')

        // tạo session để lưu refresh_token trong db
        await Session.create({
            userID: user._id,
            refreshToken: refresh_token,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        })

        // trả refresh token về trong cookie
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_TTL
        })

        // trả access token về res
        return res.status(200).json({message: "Sign in successful, hello " + user.displayName, access_token})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: 'Internal server error'})
    }
}

export async function signOut(req, res) {
    try {
        // lấy refresh token từ cookie
        const refresh_token = req.cookies?.refresh_token

        // xóa refresh token trong session
        await Session.deleteOne({
            refreshToken: refresh_token
        })

        // xóa refresh token trong cookie
        res.clearCookie('refresh_token')

        return res.status(200).json({message: 'Sign out successful'})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: 'Internal server error'})
    }
}

export async function refreshToken(req, res) {
    try {
        // Lấy refresh_token từ cookie
        const refresh_token = req.cookie?.refresh_token
        if (!refresh_token) {
            return res.status(401).json({message: "token not found"})
        }

        // So sánh refresh_token trong db
        const session = await Session.findOne({
            refreshToken: refresh_token
        })

        if (!session) {
            return res.status(403).json({message: "token het han hoac khong hop le"})
        }

        // kiểm tra xem refresh_token hết hạn chưa
        if (session.expiresAt < new Date()) {
            return res.status(403).json({message: "token het han"})
        }
        
        // Tạo access_token mới
        const access_token = jwt.sign(
            {
                userID: session.userID  // dữ liệu lưu trong token
            },
            process.env.JWT_SECRET,
            {
                expiresIn: ACCESS_TOKEN_TTL
            }
        )

        // trả access_token
        return res.status(200).json({access_token})
    } catch (error) {
        
    }
}