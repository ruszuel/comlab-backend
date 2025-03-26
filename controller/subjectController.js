import { subjModel } from "../model/model.js"

const addSubject = async (req, res) => {
    const {subject, subject_code} = req.body
    try {
        const subjects = await subjModel.findOne({subject_code})
        if(subjects){
            return res.status(400).json("Subject already exist")
        }
        const newSubject = new subjModel({subject, subject_code})
        newSubject.save();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const editSubject = async (req, res) => {
    const { _id } = req.params
    const {subject, subject_code} = req.body
    try {
        const subjects = await subjModel.findOne({_id})
        const edited = await subjModel.findOne({subject})
        const subjCode = await subjModel.findOne({subject_code})

        if(!subjects){
            return res.status(404).json("Subject not found")
        }

        if(edited){
            return res.status(400).json("Subject already exist")
        }

        if(subjCode){
            return res.status(403).json("Subject_code already exist")
        }

        const edit = await subjModel.updateOne({_id}, {$set: {subject: subject, subject_code}})
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
    const {_id} = req.params
    // const {subject} = req.body
    try {
        const subjects = await subjModel.findOne({_id})
        if(!subjects){
            return res.status(404).json("Subject not found")
        }
        const deleted = await subjModel.deleteOne({_id})
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