import { computer } from "../model/model.js";
import mongoose from "mongoose";

const getList = async(req, res) => {
  try {
    const com = await computer.find();
    res.status(200).json({
        isSuccess: true,
        com
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        isSuccess: false,
        message: "An error occurred while fetching the data.",
        error: err.message
    });
  }
}

const addComputer = async (req, res) => {
    const {name, room} = req.body
    try {
        const isExisting = await computer.findOne({name})
        if(isExisting){
            return res.sendStatus(403)
        }
        const newComputer = new computer({name, room})
        await newComputer.save();
        res.status(200).json({
            isSuccess: true,
            newComputer
        });
    } catch (error) {
        console.error(err);
        res.status(500).json({
            isSuccess: false,
            message: "An error occurred while fetching the data.",
            error: err.message
        });
    }
}

const deleteCom = async (req, res) => {
    const {_id} = req.params
    try{
        const delCom = await computer.deleteOne({_id});
        if(delCom.deletedCount === 0){
            return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json({ message: "Data set deleted successfully" });
    }catch(err){
        res.status(500).json({ error: error.message });
    }
}

// const editCom = async (req, res) => {
//     const {comID, name, room} = req.body
//     try {

//         if (!mongoose.Types.ObjectId.isValid(comID)) {
//             return res.status(400).json({ error: "Invalid ID format" });
//         }
//         const objectId = new mongoose.Types.ObjectId(comID);
//         const canEdit = await computer.findOne({"_id": objectId})
//         if(!canEdit){
//             return res.sendStatus(404)
//         }
        
//         const update = await computer.updateOne({"_id": objectId}, {$set: {name, room}})
//         if(update.modifiedCount === 0){
//             return res.sendStatus(402)
//         }

//         return res.sendStatus(200)
//     } catch (error) {
//         console.log(error)
//         return res.sendStatus(500)
//     }
// }

const editCom = async (req, res) => {
    const { _id } = req.params;
    const {comID, name, room} = req.body

    try {
        const updatedCom = await computerStats.findByIdAndUpdate(_id,{ comID, name, room });

        if (!updatedCom) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json({
            isSuccess: true,
            updatedCom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            isSuccess: false,
            message: "An error occurred while updating the data.",
            error: error.message
        });
    }
}

export default {getList, addComputer, deleteCom, editCom}