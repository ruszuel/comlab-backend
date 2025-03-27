import express from "express";
import authController from "../controller/authController.js";

const route = express.Router()

route.post('/login', authController.auth)

export default route;