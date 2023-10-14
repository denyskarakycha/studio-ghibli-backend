import express, {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';

import { ExtendedError } from 'interface/error.js';

import filmRoutes from './router/film.js'


const MONGODB_URI =
  "mongodb+srv://denys:295q6722822@cluster0.fk2cpgo.mongodb.net/studioGhibli?retryWrites=true&w=majority";
  
const app = express();

app.use(bodyParser.json());
app.use(cors({ credentials: true }));

app.use(filmRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Page not found!') as ExtendedError;
    error.statusCode = 404;
    next(error);
})

app.use((error: ExtendedError, req: Request, res: Response, next: NextFunction): void => {  
    const status = error.statusCode || 500;
    const message = error.message || "Server ocurred";
    const validationData = error.validationData || message;
    res.status(status).json({message: message, validationData: validationData});
});


mongoose.connect(MONGODB_URI)
    .then(async () => {
        const server = http.createServer(app);
        server.listen(8080, () => {
            console.log('start server');
        })
    }) 
    .catch((error: Error) => {
        console.log(error); 
    }) 



