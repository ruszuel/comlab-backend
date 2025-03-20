import express from 'express'
import {studentModel} from '../model/model.js';
import studentController from '../controller/studentController.js';

const route = express.Router();

route.get('/getStudents', async (req, res) => {
    const userData = await studentModel.find();
    res.json(userData)
})

route.post('/addStudent', studentController.addStudent)
route.delete('/deleteStudent/:student_id', studentController.deleteStudent);
route.post('/generateQR', studentController.sendQr)
route.post('/addAttendance', studentController.addToAttendance)
route.get('/getAttendance', studentController.getAttendance)

export default route;