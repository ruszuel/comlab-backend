import express from 'express'
import studentModel from '../model/model.js';
import studentController from '../controller/studentController.js';

const route = express.Router();

route.get('/getStudents', async (req, res) => {
    const userData = await studentModel.find();
    res.json(userData)
})

route.post('/addStudent', studentController.addStudent)


export default route;