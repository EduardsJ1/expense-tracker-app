import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/index';
import {startRecurringJob} from './jobs/recurring';

const app = express();

dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
const PORT= process.env.PORT || 8000;

//aaa
startRecurringJob();
app.use('/', router());
app.listen(PORT, ()=>console.log(`server running on http://localhost:${PORT}`));