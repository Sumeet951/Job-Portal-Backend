import express from 'express';
import cookieParser from 'cookie-parser';
import {config} from 'dotenv';
config();
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';
const app=express();

//Middleware
//Built In
app.use(express.json())
app.use(express.urlencoded({extended:true}));
//Third Party
app.use(cookieParser());
app.use(cors({
  origin: "https://job-portal-mu-ochre.vercel.app" || "http://localhost:5174/", // frontend URL
  credentials: true,               // allow cookies
}));
app.use(morgan('dev'));

//Srver status route
app.get('/',(req,res)=>{
    res.send("Server is working");
})
//Import all Routes
import userRoutes from './routes/user.routes.js';
import companyRoutes from './routes/company.routes.js';
import jobRoute from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
//Default catch all route
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/company',companyRoutes)
app.use("/api/v1/job",jobRoute)
app.use("/api/v1/application",applicationRoutes)
//Custom error handling middleware
app.use(errorMiddleware)
export default app;