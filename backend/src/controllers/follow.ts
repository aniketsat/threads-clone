import asyncHandler from "express-async-handler";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();
const followUser = asyncHandler(async (req, res) => {
    // @ts-ignore
    const user = req.user;

    // Get the id of the user's profile to follow
    const { id } = req.params;

    // Check if user's profile exists
    const profileExists = await prisma.profile.findUnique({
        where: {
            id
        }
    });
    if (!profileExists) {
        res.status(404);
        throw new Error("User not found");
    }

    // Get the profile of the logged in user
    const currentUserProfile = await prisma.profile.findUnique({
        where: {
            UserId: user.id
        }
    });
    if (!currentUserProfile) {
        res.status(400);
        throw new Error("User profile not found");
    }

    // Check if user's id is the same as the id in the params
    if (profileExists.id === currentUserProfile.id) {
        res.status(400);
        throw new Error("You cannot follow yourself");
    }

    // Check if user is already following the user's profile
    const isFollowing = await prisma.follow.findFirst({
        where: {
            FollowerId: currentUserProfile.id,
            FollowingId: profileExists.id
        }
    });
    if (isFollowing) {
        res.status(400);
        throw new Error("You are already following this user");
    }

    // Follow the user's profile
    await prisma.follow.create({
        data: {
            Follower: {
                connect: {
                    id: currentUserProfile.id
                }
            },
            Following: {
                connect: {
                    id: profileExists.id
                }
            }
        }
    });

    // Send a response
    res.status(201).json({
        message: `Now you are following @${profileExists.username}`
    })
});

const unfollowUser = asyncHandler(async (req, res) => {
    // @ts-ignore
    const user = req.user;

    // Get the id of the user's profile to follow
    const { id } = req.params;

    // Check if user's profile exists
    const profileExists = await prisma.profile.findUnique({
        where: {
            id
        }
    });
    if (!profileExists) {
        res.status(404);
        throw new Error("User not found");
    }

    // Get the profile of the logged in user
    const currentUserProfile = await prisma.profile.findUnique({
        where: {
            UserId: user.id
        }
    });

    // Check if user's id is the same as the id in the params
    if (profileExists.id === currentUserProfile?.id) {
        res.status(400);
        throw new Error("You cannot unfollow yourself");
    }

    // Check if user is already following the user's profile
    const isFollowing = await prisma.follow.findFirst({
        where: {
            FollowerId: currentUserProfile?.id,
            FollowingId: profileExists.id
        }
    });
    if (!isFollowing) {
        res.status(400);
        throw new Error("You are not following this user");
    }

    // Unfollow the user's profile
    await prisma.follow.deleteMany({
        where: {
            FollowerId: currentUserProfile?.id,
            FollowingId: profileExists.id
        }
    });

    // Send a response
    res.status(201).json({
        message: `You have unfollowed @${profileExists.username}`
    });
});

const getFollowersByUsername = asyncHandler(async (req, res) => {
    // Get the username of the user's profile to follow
    const { username } = req.params;

    // Check if user's profile exists
    const profileExists = await prisma.profile.findUnique({
        where: {
            username
        }
    });
    if (!profileExists) {
        res.status(404);
        throw new Error("Profile not found");
    }

    // Get the followers of the user's profile
    let followers = await prisma.follow.findMany({
        where: {
            FollowingId: profileExists.id
        },
        include: {
            Follower: true
        }
    });
    // Get the names of the followers
    for (let i = 0; i < followers.length; i++) {
        // get the UserId of the follower
        // @ts-ignore
        const UserId  = followers[i].Follower?.UserId;
        // get the user with the UserId
        const user = await prisma.user.findUnique({
            where: {
                id: UserId
            }
        });
        // add the name of the user to the followers
        followers[i] = {
            ...followers[i].Follower,
            // @ts-ignore
            name: user?.name
        }
    }

    // Send a response
    res.status(200).json({
        message: `Followers of @${profileExists.username}`,
        followers: followers
    });
});

const getFollowingByUsername = asyncHandler(async (req, res) => {
    // Get the username of the user's profile to follow
    const { username } = req.params;

    // Check if user's profile exists
    const profileExists = await prisma.profile.findUnique({
        where: {
            username
        }
    });
    if (!profileExists) {
        res.status(404);
        throw new Error("Profile not found");
    }

    // Get the followers of the user's profile
    let following = await prisma.follow.findMany({
        where: {
            FollowerId: profileExists.id
        },
        include: {
            Following: true
        }
    });
    // Get the names of the followers
    for (let i = 0; i < following.length; i++) {
        // get the UserId of the follower
        // @ts-ignore
        const UserId  = following[i].Following?.UserId;
        // get the user with the UserId
        const user = await prisma.user.findUnique({
            where: {
                id: UserId
            }
        });
        // add the name of the user to the followers
        following[i] = {
            ...following[i].Following,
            // @ts-ignore
            name: user?.name
        }
    }

    // Send a response
    res.status(200).json({
        message: `Following of @${profileExists.username}`,
        following: following
    });
});

export { followUser, unfollowUser, getFollowersByUsername, getFollowingByUsername };