import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    
    const { fullName, email, password } = req.body;

    try {

        if(!fullName || !email || !password){
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        //base checks
        if(password.length < 8){
            return res.status(400).json({
                message: 'Password must be atleast 8 characters long.'
            });
        }

        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({
                message: 'Email already exists.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            //generate JWT
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });

        } else {
            res.status(400).json({
                message: 'Invalid User Data.'
            });
        }


    } catch (error) {

        console.log("Error in signup. ", error.message);
        res.status(500).json({
            message: 'Internal Server Error'
        });

    }

};

export const login = async (req, res) => {
    
    const { email, password } = req.body;

    try {

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: 'Invalid Credentials'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: 'Invalid Credentials'
            });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error){
        console.log("Error in login. ", error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }

}

export const logout = async (req, res) => {
    
    try {
        res.cookie("jwt", "");
        res.status(200).json({
            message: "Log out successful."
        });
    } catch(error){
        console.log('Error in logout. ', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }

}

export const updateProfile = async (req, res) => {
    
    const { profilePic } = req.body;

    try {

        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message: 'Profile Pic Required.'
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {new: true});

        return res.status(200).json({
            updatedUser
        });

    } catch(error){
        console.log("Error in update route. ", error);
        return res.status(200).json({
            message: 'Internal Server Error'
        });
    }

}