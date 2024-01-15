import asyncHandler from "express-async-handler";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

const createThread = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const picture = req.file;

    // @ts-ignore
    const user = req.user;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!userExists) {
        res.status(404);
        throw new Error('User not found');
    }

    // Create thread
    const thread = await prisma.thread.create({
        data: {
            content,
            picture: picture?.path,
            Creator: {
                connect: {
                    id: userExists?.Profile?.id
                }
            }
        }
    });

    res.status(201).json({
        message: 'Thread created',
        thread
    });
});

const getAllThreads = asyncHandler(async (req, res) => {
    // @ts-ignore
    const user = req.user;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!userExists) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get threads that belong to the public profile or the user's profile or the profile to which the user is following
    const threads = await prisma.thread.findMany({
        where: {
            OR: [
                {
                    Creator: {
                        profileType: 'PUBLIC'
                    }
                },
                {
                    Creator: {
                        id: userExists?.Profile?.id
                    }
                },
                {
                    Creator: {
                        Followers: {
                            some: {
                                id: userExists?.Profile?.id
                            }
                        }
                    }
                }
            ],
            isDeleted: false
        },
        include: {
            Creator: true,
            Likes: true,
            Comments: true,
            QuotedBy: true,
            RepostTo: {
                include: {
                    Creator: true,
                    Likes: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
    });

    res.status(200).json({
        message: 'Threads fetched successfully',
        threads
    });
});

const getThread = asyncHandler(async (req, res) => {
    res.send('Get a thread');
});

const updateThread = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const picture = req.file;

    // Get thread id
    const threadId = req.params.id;

    // @ts-ignore
    const user = req.user;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!userExists) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if thread exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id: threadId
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error('Thread not found');
    }

    // Update thread
    const updatedThread = await prisma.thread.update({
        where: {
            id: threadId
        },
        data: {
            content,
            picture: picture?.path
        }
    });

    res.status(200).json({
        message: 'Thread updated',
        thread: updatedThread
    });
});

const deleteThread = asyncHandler(async (req, res) => {
    // Get thread id
    const threadId = req.params.id;

    // @ts-ignore
    const user = req.user;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!userExists) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if thread exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id: threadId
        },
    });
    if (!threadExists) {
        res.status(404);
        throw new Error('Thread not found');
    }

    // Delete thread
    await prisma.thread.update({
        where: {
            id: threadId
        },
        data: {
            isDeleted: true
        }
    });
});


export {
    createThread,
    getAllThreads,
    getThread,
    updateThread,
    deleteThread
}