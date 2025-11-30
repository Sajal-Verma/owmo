import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  roomId: String,
  requestId: String,
  senderId: String,
  senderName: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});


const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;