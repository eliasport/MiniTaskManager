import jsonwebtoken from 'jsonwebtoken';
import env from '../config/env.js';
// import { jwt } from 'jsonwebtoken';

const generateToken = (userId)=> {
    try {
        const token = jsonwebtoken.sign(
        { id: userId }, 
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN });
        // console.log(`Token: ${token}`); 
        return token;
    } catch (err) {
        throw new JsonWebTokenError(`Error generating token: ${err.message}`);
    }
}

export default generateToken;