import asyncHandler from "express-async-handler";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient()
const getCurrentUser = asyncHandler(async (req, res) => {
    // @ts-ignore
    const user = req.user;

    // Get user
    const currentUser = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!currentUser) {
        res.status(400);
        throw new Error('User does not exist');
    }

    // Get the array of followers and following
    const followers = await prisma.follow.findMany({
        where: {
            FollowingId: currentUser.Profile?.id
        },
        include: {
            Follower: true
        }
    });
    const following = await prisma.follow.findMany({
        where: {
            FollowerId: currentUser.Profile?.id
        },
        include: {
            Following: true
        }
    });

    console.log(followers, following);

    res.status(200).json({
        message: 'Get user successful',
        user: {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            username: currentUser.Profile?.username,
            avatar: currentUser.Profile?.avatar,
            bio: currentUser.Profile?.bio,
            followers: followers.map(follower => follower.Follower?.id),
            following: following.map(following => following.Following?.id),
        }
    });
});

const updateCurrentUser = asyncHandler(async (req, res) => {
    // @ts-ignore
    const user = req.user;

    const { username, bio } = req.body;
    if (!username || !bio) {
        res.status(400);
        throw new Error('Username and bio are required');
    }

    const avatar = req.file;

    // Get user
    const currentUser = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!currentUser) {
        res.status(400);
        throw new Error('User does not exist');
    }

    // Check if there is another user with the same username
    const profile = await prisma.profile.findUnique({
        where: {
            username
        }
    });
    if (profile && profile?.UserId !== user.id) {
        res.status(400);
        throw new Error('Username already exists');
    }

    // Update user profile
    const updatedProfile = await prisma.profile.update({
        where: {
            id: currentUser?.Profile?.id
        },
        data: {
            username,
            bio,
            avatar: avatar?.path
        }
    });

    // Update user
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            Profile: {
                connect: {
                    id: updatedProfile.id
                }
            }
        }
    });

    res.status(200).json({
        message: 'Update user successful',
        user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            username: updatedProfile.username,
            avatar: updatedProfile.avatar,
            bio: updatedProfile.bio,
        }
    });
});

const deleteCurrentUser = asyncHandler(async (req, res) => {
    res.send('success')
});

const getUserByUsername = asyncHandler(async (req, res) => {
    // get username from params
    const { username } = req.params;
    if (!username) {
        res.status(400);
        throw new Error('Username is required');
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
        where: {
            username
        }
    });
    if (!profile) {
        res.status(400);
        throw new Error('User does not exist');
    }

    // Get user excluding password
    const user = await prisma.user.findUnique({
        where: {
            id: profile.UserId
        },
        include: {
            Profile: true,
        }
    });
    if (!user) {
        res.status(400);
        throw new Error('Username does not exist');
    }
    // exclude password
    const {password, ...rest} = user;

    // Get the number of followers and following
    const followersCount = await prisma.follow.count({
        where: {
            FollowingId: user.Profile?.id
        }
    });
    const followingCount = await prisma.follow.count({
        where: {
            FollowerId: user.Profile?.id
        }
    });

    const updatedUser = {
        ...rest,
        followersCount,
        followingCount
    };

    res.status(200).json({
        message: 'Get user successful',
        user: updatedUser
    });
});


export {
    getCurrentUser,
    updateCurrentUser,
    deleteCurrentUser,
    getUserByUsername
}