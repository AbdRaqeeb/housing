import {sign} from 'jsonwebtoken';

export function generateToken(payload) {
    return sign(payload, process.env.JWT_SECRET, {expiresIn: 36000});
}