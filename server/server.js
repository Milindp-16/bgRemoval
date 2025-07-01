import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/Mongodb.js';
import userRouter from './routes/userRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express()
await connectDB();

//Initialize Middlewares
app.use(express.json())
app.use(cors())

//API ROUTES
app.get('/',(req,res)=> res.send("API Working"))
app.use('/api/user',userRouter)

app.listen(PORT,()=> console.log("Server running on port " + PORT))