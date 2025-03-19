import {studentModel} from "../model/model.js";

const addStudent = async (req, res) => {
    const {student_id, firstname, lastname, course, section} = req.body
    try {
        const newStudent = new studentModel({student_id, firstname, lastname, course, section})
        await newStudent.save();
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
}

export default {addStudent}