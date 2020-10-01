import { verify } from 'jsonwebtoken';

export default function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json('Access denied, No token provided');
    try {
        req.user = verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(400).json('Invalid token!');
    }
}