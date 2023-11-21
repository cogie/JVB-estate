import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'; 
dotenv.config(); //initialise


mongoose.connect(process.env.MONGO).then(()=> {
    console.log("Connected to Database");
}).catch((err)=> {
    console.log(err)
});

const app = express();

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

//api
app.use('/api/user',userRouter);

