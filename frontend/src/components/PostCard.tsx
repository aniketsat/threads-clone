import React from 'react';
import {User, Link, Image} from "@nextui-org/react";
import { BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineShareAlt } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";


type PropType = {
    child: React.ReactNode;
    isChild?: boolean;
};
function PostCard( { child, isChild }:PropType) {
    return (
        <>
            <div className="p-2" style={{border: "1px solid #eaeaea", borderRadius: "8px", marginTop: 0}}>
                {
                    isChild ? null : (
                        <p className="text-gray-50 text-xs" style={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            marginBottom: "0.25rem",
                        }}>Aniket Reposted</p>
                    )
                }

                <div className="flex flex-row items-center justify-between">
                    <User
                        name={<p className="text-gray-950 font-extrabold" style={{
                            fontSize: "1.05rem",
                            fontWeight: 700,
                        }}>Jorge Garcia</p>}
                        description={(
                            <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
                                @jrgarciadev
                            </Link>
                        )}
                        avatarProps={{
                            src: "https://avatars.githubusercontent.com/u/30373425?v=4"
                        }}
                    />
                    <BsThreeDots className="text-2xl text-gray-500 cursor-pointer"/>
                </div>

                <p className="text-gray-50 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                    euismod, nisl eget aliquam ultricies, nunc sapien aliquet nunc, vitae aliquam nisl nunc eget nunc.
                    Donec euismod, nisl eget aliquam ultricies, nunc sapien aliquet nunc, vitae aliquam nisl nunc eget
                    nunc.</p>

                <Image
                    src="https://images.unsplash.com/photo-1610552050890-fe99536c2615?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    width="100%"
                    height="auto"
                    className="mt-2"
                    alt="Post Image"
                />

                <div className="mt-2 ml-2">
                    {child}
                </div>

                {
                    isChild ? null : (
                        <div className="flex flex-row justify-between mt-2">
                            <div className="flex flex-row items-center justify-center">
                                <AiFillHeart className="text-2xl text-gray-500 cursor-pointer icon"/>
                                <AiOutlineHeart className="text-2xl text-gray-500 cursor-pointer ml-2 icon"/>
                                <FaRegComment className="text-2xl text-gray-500 cursor-pointer ml-2 icon"/>
                                <AiOutlineShareAlt className="text-2xl text-gray-500 cursor-pointer ml-2 icon"/>
                            </div>
                            <div className="flex flex-row items-center">
                                <BiRepost className="text-2xl text-gray-500 cursor-pointer icon"/>
                            </div>
                        </div>
                    )
                }

                <div className="flex flex-row justify-start mt-2">
                    <p className="text-gray-50 text-xs">1.2k likes</p>
                    <p className="text-gray-50 text-xs ml-2">1.2k comments</p>
                </div>
            </div>
        </>
    );
}

export default PostCard;