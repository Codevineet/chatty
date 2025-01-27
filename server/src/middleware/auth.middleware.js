import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message : "Unauthorized : No Token Provided"});

        const decoded = jwt.verify(token , process.env.JWT_SECRET); // decode the token with same JWT_SECRET to get the user ID

        if(!decoded) return res.status(401).json({message : "Unauthorized : Invalid Token"});

        const user = await User.findById(decoded.id).select("-password");
        if(!user) return res.status(404).json({message : "User Not Found"});

        req.user = user;
        next();

    } catch (error) {
        
        console.log(`Protect Route ${error}`);
        res.status(500).json({message : "Internal Server Error"});
    }
}