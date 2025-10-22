import mongoose from "mongoose";
import "./message.model";

export interface IChat {
  _id: mongoose.Types.ObjectId;
  chatName: string;
  isGroupChat: boolean;
  users: mongoose.Types.ObjectId[]; // include sender, receiver
  latestMessage: mongoose.Types.ObjectId | null;
  groupAdmin: mongoose.Types.ObjectId | null;
  recentlyAdded: mongoose.Types.ObjectId | null;
  recentlyRemoved: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new mongoose.Schema<IChat>(
  {
    chatName: { type: String, required: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    recentlyAdded: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    recentlyRemoved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
// if already have model use that otherwise create one

export default Chat;
