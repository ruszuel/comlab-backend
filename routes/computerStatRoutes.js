import express from 'express'
import computerStatController from '../controller/computerStatController.js';

const route = express.Router();

route.get('/getList', computerStatController.getList)
route.post('/addComputerSet', computerStatController.addComputerSet)
route.delete('/deleteComputerSet/:_id', computerStatController.deleteComputerSet)
route.post('/editComputerSet/:_id', computerStatController.editComputerSet)

export default route;