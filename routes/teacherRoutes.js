import express from 'express'
import teacherController from '../controller/teacherController.js';

const tRoute = express.Router()

tRoute.get('/getTeachers', teacherController.getFaculty);
tRoute.post('/addTeacher', teacherController.addFaculty);


export default tRoute;