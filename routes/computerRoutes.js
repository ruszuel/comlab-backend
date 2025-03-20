import express from 'express'
import computerController from '../controller/computerController.js';

const route = express.Router();

route.get('/getList', computerController.getList)

export default route;