import asyncHandler from "express-async-handler";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

const createComment = asyncHandler(async (req, res) => {
    const {threadId} = req.params;
    const {content} = req.body;

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

    // Create comment
    const comment = await prisma.comment.create({
        data: {
            content,
            Thread: {
                connect: {
                    id: threadExists.id
                }
            },
            Profile: {
                connect: {
                    id: userExists?.Profile?.id
                }
            }
        }
    });

    res.status(201).json({
        message: 'Comment created',
        comment
    });
});

const createChildComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;

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

    // Check if comment exists
    const commentExists = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            Thread: true
        }
    });
    if (!commentExists) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Create child comment
const childComment = await prisma.comment.create({
        data: {
            content,
            Thread: {
                connect: {
                    id: commentExists.Thread.id
                }
            },
            Parent: {
                connect: {
                    id: commentExists.id
                }
            },
            Profile: {
                connect: {
                    id: userExists?.Profile?.id
                }
            }
        }
    });

    res.status(201).json({
        message: 'Reply created',
        comment: childComment
    });
});

const getAllComments = asyncHandler(async (req, res) => {
    const {threadId} = req.params;

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

    // Get all comments on a thread which do not have a parent comment
    const comments = await prisma.comment.findMany({
        where: {
            ThreadId: threadExists.id,
        },
        include: {
            Profile: true,
            Likes: true,
            Children: true,
        }
    });

    res.status(200).json({
        message: 'All comments',
        comments
    });
});

const getAllChildComments = asyncHandler(async (req, res) => {
    const {commentId} = req.params;

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

    // Check if comment exists
    const commentExists = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            Thread: true
        }
    });
    if (!commentExists) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Get all child comments on a comment
    const childComments = await prisma.comment.findMany({
        where: {
            ParentId: commentExists.id
        },
        include: {
            Profile: true,
            Likes: true,
            Children: true,
        }
    });

    res.status(200).json({
        message: 'All child comments',
        comments: childComments
    });
});

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;

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

    // Check if comment exists
    const commentExists = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });
    if (!commentExists) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Check if comment belongs to user
    if (commentExists.ProfileId !== userExists?.Profile?.id) {
        res.status(401);
        throw new Error('Unauthorized');
    }

    // Update comment
    const comment = await prisma.comment.update({
        where: {
            id: commentExists.id
        },
        data: {
            content
        }
    });

    res.status(200).json({
        message: 'Comment updated',
        comment
    });
});

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;

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

    // Check if comment exists
    const commentExists = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });
    if (!commentExists) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Check if comment belongs to user
    if (commentExists.ProfileId !== userExists?.Profile?.id) {
        res.status(401);
        throw new Error('Unauthorized');
    }

    // set the isDeleted field to true
    await prisma.comment.update({
        where: {
            id: commentExists.id
        },
        data: {
            isDeleted: true,
            content: ""
        }
    });

    res.status(200).json({
        message: 'Comment deleted'
    });
});


export {
    createComment,
    createChildComment,
    getAllComments,
    getAllChildComments,
    updateComment,
    deleteComment
};