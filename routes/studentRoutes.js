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
route.delete('/deleteAllStudentAttendance', studentController.deleteAllStudentAttendance)
route.post('/addToClass', studentController.addToClass);
route.post('/updateAttendance', studentController.updateAttendance)
route.post('/transferToRecords', studentController.addToAllAttendance)
route.get('/getTotalAttendance', studentController.getTotalAttendance)
route.post('/editStudent', studentController.editStudent)
route.post('/editStatus', studentController.editStatus)

export default route;