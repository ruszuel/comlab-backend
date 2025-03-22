import express from 'express'
import computerController from '../controller/computerController.js';

const route = express.Router();

route.get('/getList', computerController.getList)
route.post('/add', computerController.addComputer)
route.delete('/deleteCom/:_id', computerController.deleteCom)
route.post('/editCom/:_id', computerController.editCom)

export default route;