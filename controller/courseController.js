import { crsModel } from "../model/model.js"

const addCourse = async (req, res) => {
    const {course} = req.body
    try {
        const courses = await crsModel.findOne({course})
        if(courses){
            return res.status(400).json("Course already exist")
        }
        const newCourse = new crsModel({course})
        newCourse.save();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const editCourse = async (req, res) => {
    const {course, edited_course} = req.body
    try {
        const courses = await crsModel.findOne({course})
        const edited = await crsModel.findOne({edited_course})
        if(!courses){
            return res.status(404).json("Course not found")
        }

        if(edited){
            return res.status(400).json("Course already exist")
        }

        const edit = await crsModel.updateOne({course}, {$set: {course: edited_course}})
        if(edit.modifiedCount === 0){
            return
        }else{
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const deleteCourse = async (req, res) => {
    const {course} = req.body
    try {
        const courses = await crsModel.findOne({course})
        if(!courses){
            return res.status(404).json("Course not found")
        }
        const deleted = await crsModel.deleteOne({course})
        if(deleted.deletedCount === 0){
            return
        }else {
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const getCourses = async (req, res) => {
    try {
        const allCourse = await crsModel.find()
        res.status(200).json(allCourse)
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

export default {addCourse, editCourse, deleteCourse, getCourses}