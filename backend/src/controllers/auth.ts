import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client'
import {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN} from "../config/secrets";
import { generateToken, verifyToken } from "../utils/token";
import { generateUsername } from "../utils/user";


const prisma = new PrismaClient()

const register = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (userExists) {
        res.status(400);
        throw new Error('Email already exists');
    }

    const username = generateUsername(email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user model
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    // Create profile model
    await prisma.profile.create({
        data: {
            username,
            User: {
                connect: {
                    id: user.id
                }
            }
        }
    });

    res.status(201).json({
        message: 'User registered successfully'
    });
});

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        res.status(400);
        throw new Error('Email does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    const accessToken = generateToken(user.id, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN);
    const refreshToken = generateToken(user.id, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);

    res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body;
    if (!refreshToken) {
        res.status(400);
        throw new Error('Please provide a refresh token');
    }

    const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({
        where: {
            // @ts-ignore
            id: decoded.id
        }
    });
    if (!user) {
        res.status(400);
        throw new Error('User does not exist');
    }

    const accessToken = generateToken(user.id, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN);

    res.status(200).json({
        message: 'Refresh token successful',
        accessToken,
        refreshToken
    });
});

const logout = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: 'Logout successful',
        accessToken: null,
        refreshToken: null
    });
});


export {login, register, refreshToken, logout};