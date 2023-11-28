import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    //verufy if user has a token and save to req.user if not send error 
    if(!token) return next(errorHandler(401, 'Unauthorized!'));

        jwt.verify (token, process.env.JWT_SECRET, (err, user) => {
            if(err) return next(errorHandler(403, 'Forbidden'));

            req.user = user;
            next();
        }); 
};