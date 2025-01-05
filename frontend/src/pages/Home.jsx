import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

const Home = () => {

    const { selectedUser } = useChatStore();

    return (
        
        <div className="bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[600px] mb-8 mt-4">
                    <div className="flex h-full rounded-lg ">

                        <Sidebar />

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

                    </div>
                </div>
            </div>
        </div>

    );
}

export default Home;