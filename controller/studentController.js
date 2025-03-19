import {studentModel} from "../model/model.js";

const addStudent = async (req, res) => {
    const {student_id, firstname, lastname, course, section} = req.body
    try {
        const isExisting = studentModel.findOne({student_id})

        if(isExisting){
            return res.sendStatus(403);
        }
        
        const newStudent = new studentModel({student_id, firstname, lastname, course, section})
        await newStudent.save();
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export default {addStudent}