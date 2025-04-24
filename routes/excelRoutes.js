import express from 'express';
import uploadExcel from '../controller/excelController'
const route = express.Router();

route.post('/uploadExcel', uploadExcel);

export default route;
