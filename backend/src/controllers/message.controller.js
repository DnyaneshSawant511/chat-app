import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

//controller to get a list of all users except for the current logged in user
export const getUsersForSideBar = async (req, res) => {

    try {

        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId} }).select("-password");

        res.status(200).json({
            filteredUsers
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            error: "Internal Server Error"
        });

    }

}

//controller to get the chat history of the current logged in user with a particular user
export const getMessages = async (req, res) => {

    try {

        const { id:otherUserId } = req.params; //id of other user passed in params
        const myId = req.user._id;

        const messages = await Message.find({
            //either of the conditions satisfy
            $or : [
                {senderId: myId, receiverId: otherUserId},
                {senderId: otherUserId, receiverId: myId}
            ]
        });

        res.status(200).json({
            messages
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }

}

export const sendMessage = async (req, res) => {

    try {

        const { text, image } = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({
            newMessage
        });

    } catch(error){
        console.log(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }

}