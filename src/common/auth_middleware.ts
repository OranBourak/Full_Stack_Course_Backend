import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// This middleware function checks if the request has a valid token in the Authorization header.
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log("auth middleware");
    //get the token from the header
    const authHeader = req.headers['authorization'];
     //split the token from the header and get the second part which is the token itself
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send("missing token");
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("invalid token");
        }
        req.body.user = user;
        next();
    });
}

export default authMiddleware;