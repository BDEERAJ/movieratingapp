import express from 'express';
import cors from 'cors';
const app=express();
import { connectDB } from './DataBase/Db.js';
import moviesRoutes from './Protected_Routes/Movies.js';
import reviewsRoutes from './Protected_Routes/Reviews.js';
import userRoutes from './Protected_Routes/userRoutes.js';
import watchlistRoutes from './Protected_Routes/Watchlist.js';
import JwtAuth from './AUTH/jwt.js'
connectDB();
app.use(cors());
app.use(express.json());
app.use('/',JwtAuth);
app.use('/movies',moviesRoutes);
app.use('/api',reviewsRoutes);
app.use('/apiU',userRoutes);
app.use('/apiW',watchlistRoutes);
app.listen(3000);