import express from 'express'
import teacherController from '../controller/teacherController.js';
import { teacherModel } from '../model/model.js';

const tRoute = express.Router()

tRoute.get('/getTeachers', teacherController.getFaculty);
tRoute.post('/addTeacher', teacherController.addFaculty);
tRoute.delete('/deleteTeacher', teacherController.deleteFaculty)

export default tRoute;