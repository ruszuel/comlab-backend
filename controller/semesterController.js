import { semesterModel } from "../model/model.js"

const addSemester = async (req, res) => {
    const {semester_type, school_year, start, end, status} = req.body
    try {
        const newSemester = new semesterModel({semester_type, school_year, start, end, status})
        newSemester.save();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const editSemester = async (req, res) => {
    const {_id} = req.params
    const {semester_type, school_year, start, end, status} = req.body
    try {
        await semesterModel.updateOne({_id}, {$set: {semester_type, school_year, start, end, status}})
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const deleteSemester = async (req, res) => {
    const {_id} = req.params
    try {
        const semester = await semesterModel.findOne({_id})
        if(!sections){
            return res.status(404).json("Semester not found")
        }
        const deleted = await semesterModel.deleteOne({_id})
        if(deleted.deletedCount === 0){
            return
        }else {
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const getSemester = async (req, res) => {
    try {
        const allSemester = await semesterModel.find()
        res.status(200).json(allSemester)
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

export default {addSemester, editSemester, deleteSemester, getSemester}