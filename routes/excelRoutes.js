import express from 'express'
import excelController from '../controller/excelController.js';

const route = express.Router();

route.post('/uploadExcel', excelController.uploadExcel)

export default route;