import {sign} from 'jsonwebtoken';

export function generateToken(payload, JWT) {
    return sign(payload, JWT, {expiresIn: 36000});
}

export function generateTokenReset(payload, JWT) {
    return sign(payload, JWT, {expiresIn: '20m'});
}