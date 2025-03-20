import express from 'express'
import teacherController from '../controller/teacherController.js';
import { teacherModel } from '../model/model.js';

const tRoute = express.Router()

tRoute.get('/getTeachers', teacherController.getFaculty);
tRoute.post('/addTeacher', teacherController.addFaculty);
tRoute.delete('/deleteTeacher/:teacher_id', teacherController.deleteFaculty)
router.get('/getSpecificTeacher/:teacher_id', teacherController.getSpecificId);

export default tRoute;