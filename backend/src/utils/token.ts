import jwt from 'jsonwebtoken';

const generateToken = (id: string, secret: string, expiresIn: string): string => {
    return jwt.sign({ id }, secret, { expiresIn });
}

const verifyToken = (token: string, secret: string): string | object => {
    return jwt.verify(token, secret);
}


export { generateToken, verifyToken };