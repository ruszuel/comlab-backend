import express from 'express';
import scheduleController from '../controller/scheduleController.js';

const route = express.Router()

route.post('/addSchedule', scheduleController.addSchedules)
route.delete('/deleteSched', scheduleController.deleteSched)
route.get('/getSched', scheduleController.getAllSchedules)
route.put('/updateSched', scheduleController.editSched)

export default route