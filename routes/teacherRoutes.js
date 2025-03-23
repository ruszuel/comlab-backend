import express from 'express'
import teacherController from '../controller/teacherController.js';

const tRoute = express.Router()

tRoute.get('/getTeachers', teacherController.getFaculty);
tRoute.post('/addTeacher', teacherController.addFaculty);
tRoute.delete('/deleteTeacher/:teacher_id', teacherController.deleteFaculty)
tRoute.get('/getSpecificTeacher/:teacher_id', teacherController.getSpecificId);
tRoute.post('/teacher-login', teacherController.facultyLogIn)
tRoute.post('/teacherQR', teacherController.sendFacultyQr)
tRoute.post('/addToAttendance', teacherController.addTeacherAttendance)
tRoute.post('/updateAttendance', teacherController.updateTeacherAttendance)
tRoute.post('/editTeacher', teacherController.editTeacher)

export default tRoute;