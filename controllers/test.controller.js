import mongoose from "mongoose";
import UserModel from "../models/User.js";

export const listCollections = async (req, res) => {
    try{
        const db = mongoose.connection.db;

        if(!db) {
          res.status(500).json({
            'mesaage': '❌ Bad connection to Database'
          });
        }

        const collection = await db.listCollections().toArray();

        res.status(200).json({
            'number': collection.length,
            'collection': collection
        });
    } catch(error) {
        res.status(500).json({
            'message': "❌ Error"
        });
    }
} 

export const createUser = async (req, res) => {
     try {
        // ----> get data from app
        const data = req.body;

        // ----> we convert `data` in `User`
        const user = new UserModel(data);

        // ----> we save `user` in db
        await user.save();

        // ----> send response to `app`
        res.status(201).json({
            infos: "✅ user is creating successfully",
            model: user
        });
     } catch(err) {
        console.info("❌ Error occured during creation");
        res.status(400).json({
            message: "❌ Error occured during creation",
            error: err.mesaage
        });
     }
} 