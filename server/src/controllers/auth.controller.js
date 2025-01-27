import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signupController = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {

        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        }
        else {
            res.status(400).json(({ message: "Invalid user data" }));
        }

    } catch (error) {
        console.log(`Signup controller Error : ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
            message: "Logged in successfully"
        })

    } catch (error) {
        console.log(`Login Controller  ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logoutController = async (req, res) => {

    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(`Logout Controller Error : ${error}`);
        res.status(500).json({ message: "Internal server Error" });
    }
}


export const updateProfileController = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id

        if (!profilePic) return res.status(400).json({ message: "Profile Pic is required" });
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url,
        }, { new: true });

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log(`Profile Picture update ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
}