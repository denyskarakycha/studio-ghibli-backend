import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';

const MONGODB_URI =
  "mongodb+srv://denys:295q6722822@cluster0.fk2cpgo.mongodb.net/studioGhibli?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.json());
app.use(cors({ credentials: true }));

mongoose.connect(MONGODB_URI)
    .then(() => {
        const server = http.createServer(app);
        server.listen(8080, () => {
            console.log('start server');
        })
    }) 
    .catch((error: Error) => {
        console.log(error); 
    }) 



