import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided." 
            })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ 
                success: false,
                message: "Access denied. Invalid token." 
            })
        }

        // Fetch user data and attach to request
        const user = await User.findById(decoded.userId).select("-password")
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "User not found." 
            })
        }

        req.userId = decoded.userId
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ 
            success: false,
            message: "Access denied. Invalid token." 
        })
    }
}

export default isAuth