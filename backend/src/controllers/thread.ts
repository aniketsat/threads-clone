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
                        id: userExists.Profile?.id
                    }
                },
                {
                    Creator: {
                        Followings: {
                            some: {
                                FollowerId: userExists.Profile?.id
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
            RepostedBy: true,
            QuotedBy: true,
            QuoteTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
            RepostTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
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
    const {id} = req.params;

    // @ts-ignore
    const user = req.user;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true,
        }
    });
    if (!userExists) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if thread exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id
        },
        include: {
            Creator: true,
            Likes: true,
            Comments: true,
            RepostedBy: true,
            QuotedBy: true,
            QuoteTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
            RepostTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error('Thread not found');
    }

    res.status(200).json({
        message: 'Thread fetched successfully',
        thread: threadExists
    });
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

    res.status(200).json({
        message: 'Thread deleted'
    });
});

const getThreadsByUser = asyncHandler(async (req, res) => {
    const { username } = req.params;

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

    // Check if any profile exists with the username
    const profileExists = await prisma.profile.findUnique({
        where: {
            username
        }
    });
    if (!profileExists) {
        res.status(404);
        throw new Error('Profile not found');
    }

    // Get threads by the profile
    const threads = await prisma.thread.findMany({
        where: {
            Creator: {
                id: profileExists.id
            },
            isDeleted: false,
            RepostedBy: null,
            QuotedBy: null,
        },
        include: {
            Creator: true,
            Likes: true,
            Comments: true,
            RepostedBy: true,
            QuotedBy: true,
            QuoteTo: true,
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

const quoteThread = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {content} = req.body;
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

    // Check if thread exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error('Thread not found');
    }

    // Create a new thread with the quoted content and picture
    // and add the user profile as the QuotedBy
    const thread = await prisma.thread.create({
        data: {
            content,
            picture: picture?.path,
            Creator: {
                connect: {
                    id: userExists?.Profile?.id
                }
            },
            QuotedBy: {
                connect: {
                    id: userExists?.Profile?.id
                }
            },
            QuoteTo: {
                connect: {
                    id: threadExists?.id
                }
            }
        }
    });

    res.status(201).json({
        message: 'Thread quoted',
        thread
    });
});

const repostThread = asyncHandler(async (req, res) => {
    const {id} = req.params;

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
            id
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error('Thread not found');
    }

    // Create a new thread with the same content and picture as the original thread
    // and add the user profile as the RepostedBy
    const thread = await prisma.thread.create({
        data: {
            content: threadExists.content,
            picture: threadExists.picture,
            Creator: {
                connect: {
                    id: userExists?.Profile?.id
                }
            },
            RepostedBy: {
                connect: {
                    id: userExists?.Profile?.id
                }
            },
            RepostTo: {
                connect: {
                    id: threadExists?.id
                }
            }
        }
    });

    res.status(201).json({
        message: 'Thread reposted',
        thread
    });
});

const getRepostsByUser = asyncHandler(async (req, res) => {
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

    // Get username from params
    const { username } = req.params;

    // Check if any profile exists with the username
    const profileExists = await prisma.profile.findUnique({
        where: {
            username
        }
    });
    if (!profileExists) {
        res.status(404);
        throw new Error('Profile not found');
    }

    // Get threads that are reposted by the user
    const threads = await prisma.thread.findMany({
        where: {
            RepostedById: profileExists.id,
            isDeleted: false
        },
        include: {
            Creator: true,
            Likes: true,
            Comments: true,
            RepostedBy: true,
            QuotedBy: true,
            QuoteTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
            RepostTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
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

const getQuotesByUser = asyncHandler(async (req, res) => {
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

    // Get username from params
    const { username } = req.params;

    // Check if any profile exists with the username
    const profileExists = await prisma.profile.findUnique({
        where: {
            username
        }
    });
    if (!profileExists) {
        res.status(404);
        throw new Error('Profile not found');
    }

    // Get threads that are quoted by the user
    const threads = await prisma.thread.findMany({
        where: {
            QuotedById: profileExists.id,
            isDeleted: false
        },
        include: {
            Creator: true,
            Likes: true,
            Comments: true,
            RepostedBy: true,
            QuotedBy: true,
            QuoteTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
            RepostTo: {
                include: {
                    Creator: true,
                    Likes: true,
                    Comments: true,
                }
            },
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


export {
    createThread,
    getAllThreads,
    getThread,
    updateThread,
    deleteThread,
    getThreadsByUser,
    quoteThread,
    repostThread,
    getRepostsByUser,
    getQuotesByUser
}