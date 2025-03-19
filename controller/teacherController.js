import {teacherModel} from '../model/model.js'

const getFaculty = async(req, res) => {
    try{
        const teachers = await teacherModel.find();
        res.status(200).json(teachers)
    }catch(err){
        console.log(err);
    }
}

const addFaculty = async (req, res) => {
    const {teacher_id, firstname, lastname, courses, sections} = req.body
    try {
        const isExisting = await teacherModel.findOne({teacher_id})
        if(isExisting){
            return res.sendStatus(403)
        }
        const newFaculty = new teacherModel({teacher_id, firstname, lastname, courses, sections})
        await newFaculty.save();
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

const deleteFaculty = async (req, res) => {
    const {teacher_id} = req.body
    try{
        const delTeacher = await studentModel.deleteOne({teacher_id});
        if(delTeacher.deletedCount === 0){
            return res.sendStatus(404);
        }

        res.sendStatus(200);
    }catch(err){
        res.status(500).json({ error: error.message });
    }
}


export default {addFaculty, getFaculty, deleteFaculty}