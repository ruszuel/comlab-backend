import { subjModel } from "../model/model.js"

const addSubject = async (req, res) => {
    const {subject} = req.body
    try {
        const subjects = await subjModel.findOne({subject})
        if(subjects){
            return res.status(400).json("Subject already exist")
        }
        const newSubject = new subjModel({subject})
        newSubject.save();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const editSubject = async (req, res) => {
    const {subject, edited_subject} = req.body
    try {
        const subjects = await subjModel.findOne({subject})
        const edited = await subjModel.findOne({edited_subject})
        if(!subjects){
            return res.status(404).json("Subject not found")
        }

        if(edited){
            return res.status(400).json("Subject already exist")
        }

        const edit = await subjModel.updateOne({subject}, {$set: {subject: edited_subject}})
        if(edit.modifiedCount === 0){
            return
        }else{
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const deleteSubject = async (req, res) => {
    const {subject} = req.body
    try {
        const subjects = await subjModel.findOne({subject})
        if(!subjects){
            return res.status(404).json("Subject not found")
        }
        const deleted = await subjModel.deleteOne({subject})
        if(deleted.deletedCount === 0){
            return
        }else {
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const getSubjects = async (req, res) => {
    try {
        const allSubject = await subjModel.find()
        res.status(200).json(allSubject)
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

export default {addSubject, editSubject, deleteSubject, getSubjects}