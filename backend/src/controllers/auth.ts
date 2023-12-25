import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client'
import Prisma from '@prisma/client';
import {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN} from "../config/secrets";
import { generateToken, verifyToken } from "../utils/token";
import { generateUsername } from "../utils/user";


const prisma = new PrismaClient()

const login = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (!email || !password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    // Check if profile exists
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    // Generate access token
    const accessToken = generateToken(user.id, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN);

    // Generate refresh token
    const refreshToken = generateToken(user.id, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);

    // Send tokens
    res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        profile
    });
});

const register = asyncHandler(async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({ data: { name, email, password } });

    // Generate username
    let username = generateUsername(email);
    while (await prisma.profile.findUnique({ where: { username } })) {
        username = generateUsername(email);
    }

    // Create profile
    const profile = await prisma.profile.create({ data: { username, User: { connect: { id: user.id } } } });

    res.status(201).json({
        message: 'Registration successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        profile
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400);
        throw new Error('Please provide a refresh token');
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET) as Prisma.User;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
        res.status(400);
        throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = generateToken(user.id, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN);

    // Send access token
    res.status(200).json({
        message: 'Access token generated',
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
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