import PostCard from "../components/PostCard.tsx";

function HomePage() {
    return (
        <div className="main-container w-full flex flex-col gap-4">
            <PostCard child={null} />
            <PostCard child={
                <PostCard child={null} isChild={true} />
            }/>
        </div>
    );
}

export default HomePage;