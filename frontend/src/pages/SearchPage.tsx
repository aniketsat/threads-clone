import React from "react";
import { FaSearch } from "react-icons/fa";
import {Input, Tabs, Tab} from "@nextui-org/react";
import Search_Post from "../components/Search_Post.tsx";
import Search_User from "../components/Search_User.tsx";


function SearchPage() {
    const [searchText, setSearchText] = React.useState("");
    const [selectedTab, setSelectedTab] = React.useState("users");

    React.useEffect(() => {
        // hit the api when I pause typing for 500ms
        const timeout = setTimeout(() => {
            console.log(searchText);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [searchText]);

    return (
        <div className="main-container w-full flex flex-col gap-4">
            <Input
                placeholder="Search"
                startContent={<FaSearch className="text-gray-400"/>}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <Tabs
                fullWidth
                variant="underlined" 
                selectedKey={selectedTab}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                onSelectionChange={setSelectedTab}
            >
                <Tab key="users" title="Users">
                    <p className="w-full text-medium mb-4">
                        Please search for a user or post.
                        Here are the search results for: {searchText}
                    </p>
                    <Search_User/>
                </Tab>
                <Tab key="posts" title="Posts">
                    <p className="w-full text-medium mb-4">
                        Please search for a user or post.
                        Here are the search results for: {searchText}
                    </p>
                    <Search_Post/>
                </Tab>
            </Tabs>
        </div>
    );
}

export default SearchPage;