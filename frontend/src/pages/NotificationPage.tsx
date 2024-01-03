import { Tab, Tabs} from "@nextui-org/react";


function NotificationPage() {
    return (
        <div className="main-container w-full flex flex-col gap-4">
            <Tabs className="w-full" variant="underlined">
                <Tab title="All">
                    <p>All</p>
                </Tab>
                <Tab title="Follows">
                    <p>Follows</p>
                </Tab>
                <Tab title="Mentions">
                    <p>Mentions</p>
                </Tab>
                <Tab title="Likes">
                    <p>Likes</p>
                </Tab>
                <Tab title="Comments">
                    <p>Comments</p>
                </Tab>
                <Tab title="Reposts">
                    <p>Reposts</p>
                </Tab>
                <Tab title="Quotes">
                    <p>Quotes</p>
                </Tab>
            </Tabs>
        </div>
    );
}

export default NotificationPage;