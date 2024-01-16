import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
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

    // Get the profile of the user
    const profile = await prisma.profile.findUnique({
        where: {
            UserId: user.id
        },
        include: {
            Followers: true,
            Followings: true,
            Threads: true,
            Bookmarks: true,
            Quotes: true,
            Reposts: true,
            Likes: {
                include: {
                    Thread: true
                }
            }
        }
    });

    res.status(200).json({
        message: 'Get user successful',
        user: {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            username: currentUser.Profile?.username,
            avatar: currentUser.Profile?.avatar,
            bio: currentUser.Profile?.bio,
            profileId: profile?.id,
            profileType: currentUser.Profile?.profileType,
            followers: profile?.Followers?.map(follower => follower.FollowingId),
            following: profile?.Followings?.map(following => following.FollowerId),
            CreatedThreads: profile?.Threads?.filter(thread => !thread.isDeleted).map(thread => thread.id),
            BookmarkedThreads: profile?.Bookmarks?.map(bookmark => bookmark.ThreadId),
            // @ts-ignore
            LikedThreads: profile?.Likes?.filter(like => !like.Thread.isDeleted).map(like => like.ThreadId),
            QuotedThreads: profile?.Quotes?.filter(quote => !quote.isDeleted).map(quote => quote.QuoteToId),
            RepostedThreads: profile?.Reposts?.filter(repost => !repost.isDeleted).map(repost => repost.RepostToId),
        }
    });
});

const updateCurrentUser = asyncHandler(async (req, res) => {
    // @ts-ignore
    const user = req.user;

    const { username, bio } = req.body;
    if (!username) {
        res.status(400);
        throw new Error('Username is required');
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
            id: currentUser.Profile?.id
        },
        data: {
            username: username,
            bio: bio || '',
            avatar: avatar?.path
        }
    });

    res.status(200).json({
        message: 'Update user successful',
        user: {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            username: updatedProfile?.username,
            avatar: updatedProfile?.avatar,
            bio: updatedProfile?.bio,
            profileType: updatedProfile?.profileType,
        }
    });
});

const deleteCurrentUser = asyncHandler(async (req, res) => {
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

    // Delete profile
    await prisma.profile.delete({
        where: {
            id: currentUser.Profile?.id
        }
    });

    // Delete user
    await prisma.user.delete({
        where: {
            id: user.id
        }
    });

    res.status(200).json({
        message: 'Delete user successful'
    });
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

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        res.status(400);
        throw new Error('Old password and new password are required');
    }

    // @ts-ignore
    const user = req.user;

    // Get user
    const currentUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    // Check if old password is correct
    // @ts-ignore
    const isMatch = await bcrypt.compare(oldPassword, currentUser?.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Old password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword
        }
    });

    res.status(200).json({
        message: 'Update password successful',
        user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
        }
    });
});

const changeProfileType = asyncHandler(async (req, res) => {
    // @ts-ignore
    const user = req.user;

    // Get user
    const currentUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });
    if (!currentUser) {
        res.status(400);
        throw new Error('User does not exist');
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
        where: {
            UserId: user.id
        }
    });
    if (!profile) {
        res.status(400);
        throw new Error('Profile does not exist');
    }

    // Update user profile
    const updatedProfile = await prisma.profile.update({
        where: {
            id: profile.id
        },
        data: {
            profileType: profile.profileType === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'
        }
    });

    res.status(200).json({
        message: `Your profile is now ${updatedProfile.profileType.toLowerCase()}`,
        profileType: updatedProfile.profileType
    });
});


export {
    getCurrentUser,
    updateCurrentUser,
    deleteCurrentUser,
    getUserByUsername,
    updatePassword,
    changeProfileType
}