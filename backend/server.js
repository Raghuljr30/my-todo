import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';

dotenv.config();
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('connected to db');
})
.catch((err)=>{
    console.log(err.message);
})


const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/users',userRouter);
app.use('/api/tasks',taskRouter);


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`serve at http://localhost:${port}`)
})
