import express from 'express'
import computerController from '../controller/computerController.js';

const route = express.Router();

route.get('/getList', computerController.getList)
route.get('/add', computerController.addComputer)

export default route;