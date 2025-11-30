import { useEffect, useState, useRef, useContext } from "react";
import io from "socket.io-client";
import axiosInstance from "../utils/authInterceptor";
import { store } from "../context/StoreProvider";
import { useParams } from "react-router-dom";

let socket;

export default function ChatRoom() {

    const { user } = useContext(store);
    const { id } = useParams();
    const roomId = "request_" + id;

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const msgEnd = useRef(null);

    // CONNECT SOCKET
    useEffect(() => {
        socket = io("http://localhost:8000", {
            transports: ["websocket"],
        });

        socket.emit("joinRoom", { roomId, userId: user.id });

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.emit("leaveRoom", { roomId });
            socket.disconnect();
        };
    }, []);


    // LOAD OLD MESSAGES
    useEffect(() => {
        axiosInstance.get(`/request/chat/${id}`).then((res) => {
            setMessages(res.data);  // already in correct order
        });
    }, [id]);

    // AUTO SCROLL
    useEffect(() => {
        msgEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!text.trim()) return;

        const msg = {
            roomId,
            senderId: user.id,
            senderName: user.name,
            message: text,
        };

        socket.emit("sendMessage", msg);
        setText("");
    };

    return (
        <div className="flex flex-col space-y-12 py-10 items-center bg-[#F2F0EF] w-full max-x-4xl px-4 scroll-smooth">
            <div className="flex flex-col h-96 w-5/6 max-w-4xl bg-[#BBBDBC] rounded-lg">

                {/* CHAT MESSAGES */}
                <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
                    {messages.map((m) => {
                        const sender = m.senderId?._id || m.senderId;
                        const isSender = String(sender) === String(user.id);

                        return (
                            <div
                                key={m._id}
                                className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-2 max-w-[70%] rounded-xl shadow 
                                    ${isSender ? "bg-[#73a399] text-white rounded-tr-none" : "bg-[#dbdbdb] text-gray-800 rounded-tl-none"}`}
                                >
                                    <div>{m.message}</div>
                                    <div className="text-[10px] text-gray-600 text-right">
                                        {new Date(m.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={msgEnd}></div>
                </div>

                {/* INPUT */}
                <div className="p-3 bg-[#a6a7a6] rounded-b-lg flex gap-2 border-t">
                    <input
                        className="flex-1 border rounded-lg p-2"
                        placeholder="Type a message…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-[#52AB98] text-white px-4 py-2 rounded-lg"
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
}
