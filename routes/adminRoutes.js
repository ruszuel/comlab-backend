import express from "express";
import adminController from "../controller/adminController.js";

const route = express.Router()

route.post('/addAdmin', adminController.addAdmin)
route.post('/editAdmin/:id', adminController.editAdmin)
route.delete('/deleteAdmin/:_id', adminController.deleteAdmin)
route.get('/getAdmins', adminController.getAdmins)
route.post('/admin-log', adminController.adminLog)


export default route