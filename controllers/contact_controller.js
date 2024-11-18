import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import MessageModel from "../models/MessageModel.js";

export const searchContacts = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required", success: false })
        }

        const validTerm = searchTerm.replace(/[^a-zA-Z]/g, '')

        // remove the all apart from that letters
        const regex = new RegExp(validTerm, 'i');


        const contacts = await UserModel.find({
            $and: [
                { _id: { $ne: req.user.userId } },
                {
                    $or: [
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                }
            ],


        })


        if (contacts.length <= 0) {
            return res.status(400).json({ message: "No contacts found", success: false, contacts: [] })
        }

        return res.status(201).json({
            success: true,
            contacts
        })
    } catch (error) {
        return res.status(501).json({ success: false, message: error })

    }

}


export const getContactForDMList = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Token is required for DM List" });
    }

    try {
        let userId = req.user.userId;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await MessageModel.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]  // Matches documents where the user is either the sender or receiver
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$createdAt" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },

            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    firstName: "$contactInfo.firstName",
                    email: "$contactInfo.email",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            {
                $sort: {
                    lastMessageTime: -1
                }
            }

        ]);

        return res.status(200).json({
            success: true,
            contacts
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



export const getAllContacts = async (req, res) => {
    const currenUserId = req.user.userId
    try {
        const users = await UserModel.find({
            _id: {
                $ne: currenUserId
            }

        }).select('firstName lastName _id email');

       

        const contacts = users.map(user=>{
            return ({
                label: user.firstName && user.lastName ?`${user.firstName} ${user.lastName}` :`${user.email}`,
                value:user._id
            })
        })



        return res.status(201).json({
            success: true,
            contacts
        })
    } catch (error) {
        return res.status(501).json({ success: false, message: error })

    }

}
