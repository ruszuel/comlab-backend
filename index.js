import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors'
import helmet from 'helmet'
import studentRoutes from './routes/studentRoutes.js'
import tRoute from './routes/teacherRoutes.js';

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
app.use(helmet())
app.use('/api/student', studentRoutes)
app.use('/api/teacher', tRoute)

mongoose.connect(MONGOURL).then(() => {
    console.log("database is connected succesfully");
    app.listen(port, () => {
        console.log(`listening to port ${port}`)
    })
}).catch((err) => console.log(err));
