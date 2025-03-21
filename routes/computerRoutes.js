import express from 'express'
import computerController from '../controller/computerController.js';

const route = express.Router();

route.get('/getList', computerController.getList)
route.post('/add', computerController.addComputer)
route.delete('/deleteCom', computerController.deleteCom)

export default route;