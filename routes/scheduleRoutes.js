import express from 'express';
import scheduleController from '../controller/scheduleController.js';

const route = express.Router()

route.post('/addSchedule', scheduleController.addSchedule)
route.delete('/deleteSched', scheduleController.deleteSchedule)
route.get('/getSched', scheduleController.getAllSchedules)

export default route