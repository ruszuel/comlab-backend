import {studentModel} from "../model/model.js";

const addStudent = async (req, res) => {
    const {student_id, firstname, lastname, course, section} = req.body
    try {
        const isExisting = await studentModel.findOne({student_id})

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

const deleteStudent = async (req, res) => {
    const {student_id} = req.body
    try{
        const delStud = await studentModel.deleteOne({student_id});
        if(delStud.deletedCount === 0){
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    }catch(err){
        res.status(500).json({ error: error.message });
    }
}

export default {addStudent, deleteStudent}