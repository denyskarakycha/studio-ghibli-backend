import { RequestHandler } from "express";

import Film, { IFilmModel } from "../models/film.js"


export const getFilms: RequestHandler = async (req, res, next) => {
    try {
        const totalItems = await Film.find().countDocuments();
        const films: IFilmModel[] = await Film.find();
        
        res.status(200).json({films: films, totalItems: totalItems});
    } catch (error) { 
        next(error);
    }
} 

    