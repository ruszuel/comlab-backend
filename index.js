import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors'
import helmet from 'helmet'
import fileUpload from 'express-fileupload';

import studentRoutes from './routes/studentRoutes.js'
import tRoute from './routes/teacherRoutes.js';
import computerRoutes from "./routes/computerRoutes.js"
import computerStatRoutes from "./routes/computerStatRoutes.js"
import scheduleRoutes from "./routes/scheduleRoutes.js"
import academicRoutes from "./routes/academicRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import excelRoutes from './routes/excelRoutes.js';

const app = express();
dotenv.config();
const port = 3000;
const MONGOURL = process.env.MONGO_URL;

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

app.use('/api/student', studentRoutes)
app.use('/api/teacher', tRoute)
app.use('/api/computer', computerRoutes)
app.use('/api/computerStat', computerStatRoutes)
app.use('/api/schedule', scheduleRoutes)
app.use('/api/acads', academicRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/excel', excelRoutes)


mongoose.connect(MONGOURL).then(() => {
    console.log("database is connected succesfully");
    app.listen(port, () => {
        console.log(`listening to port ${port}`)
    })
}).catch((err) => console.log(err));
