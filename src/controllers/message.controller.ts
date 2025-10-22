import Chat from "@/models/chat.model";
import Message from "@/models/message.model";
import { NextFunction, Request, Response } from "express";

export const allMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate({
        path: "sender",
        select: "name pic email",
      })
      .populate("readBy", "name pic email")
      .exec();

    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this chat" });
    }

    res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chat, content } = req.body;

    // Fetch chat and users
    const chatDoc = await Chat.findById(chat).select("users").exec();

    if (!chatDoc) {
      res.status(404);
      throw new Error("Chat not found");
    }

    // Exclude sender from readBy
    const readBy = chatDoc.users.filter(
      (user: any) => user.toString() !== req.user._id.toString()
    );

    // Create the message

    let newMessage = await Message.create({
      chat,
      content,
      sender: req.user._id,
      readBy,
    });

    const message = await await Message.findById(newMessage._id)
      .populate("sender", "name pic email")
      .populate("readBy", "name pic email")
      .populate("chat")
      .exec();

    if (!message) {
      res.status(400);
      throw new Error("Failed to send message");
    }

    // Update chat's latestMessage field
    await Chat.findByIdAndUpdate(chat, {
      latestMessage: message?._id,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    next(err);
  }
};
