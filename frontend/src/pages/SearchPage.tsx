import { FaSearch } from "react-icons/fa";
import {Input, Tabs, Tab} from "@nextui-org/react";

function SearchPage() {
    return (
        <div className="main-container w-full flex flex-col gap-4">
            <Input
                placeholder="Search"
                startContent={
                    <FaSearch className="text-gray-400"/>
                }
            />

            <Tabs variant="underlined">
                <Tab title="Posts">
                    <p>Posts</p>
                </Tab>
                <Tab title="Users">
                    <p>Users</p>
                </Tab>
            </Tabs>
        </div>
    );
}

export default SearchPage;