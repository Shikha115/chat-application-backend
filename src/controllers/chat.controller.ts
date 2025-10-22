import Chat from "@/models/chat.model";
import User from "@/models/user.model";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

export const fetchChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat = await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      })
      .sort({ updatedAt: -1 });

    if (!chat) {
      res.status(404);
      throw new Error("No chats found");
    }
    res.status(200).json({
      message: "Chats fetched successfully",
      data: chat,
    });
  } catch (err) {
    next(err);
  }
};

// create or fetch 1 on 1 chat
export const accessChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400);
      throw new Error("User ID is required");
    }

    // Find existing one-to-one chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId, req.user._id] },
    })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      });

    // If chat doesn't exist, create it
    if (!chat) {
      const chatName = await User.findById(userId).select("name");
      chat = await Chat.create({
        users: [req.user._id, userId],
        chatName: chatName?.name || "",
        isGroupChat: false,
      });

      // Re-populate after creation
      chat = await Chat.findById(chat._id)
        .populate("users", "-password")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "-password",
          },
        });
    }

    return res.status(200).json({
      message: "Chat retrieved",
      data: chat,
    });
  } catch (err) {
    next(err);
  }
};

export const createGroupChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { users, chatName } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      res.status(400);
      throw new Error("Users array is required");
    }

    if (users.length < 1) {
      res.status(400);
      throw new Error("At least one user is required");
    }

    if (!chatName) {
      res.status(400);
      throw new Error("Chat name is required");
    }

    // Create the group chat
    let chat = await Chat.create({
      users: [...users, req.user._id],
      chatName,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    if (!chat) {
      res.status(400);
      throw new Error("Failed to create group chat");
    }

    let populatedChat = await Chat.findById(chat._id)
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      });

    res.status(200).json({
      message: "Chat retrieved",
      data: populatedChat,
    });
  } catch (err) {
    next(err);
  }
};

export const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const obj = req.body;

    if (!req.params.id || !obj) {
      res.status(400);
      throw new Error("Chat ID and chat details are required");
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { ...obj },
      { new: true }
    )
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      });

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    res.status(200).json({
      message: "Group chat renamed successfully",
      data: chat,
    });
  } catch (err) {
    next(err);
  }
};

export const addToGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      res.status(400);
      throw new Error("Chat ID and User ID are required");
    }

    // Check if user already exists in chat
    const chat = await Chat.findOne({ _id: chatId, users: userId });
    if (chat) {
      res.status(400);
      throw new Error("User is already in the group");
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { users: userId },
        $set: {
          recentlyAdded: new Types.ObjectId(userId),
          recentlyRemoved: null,
        },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("recentlyAdded", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "-password" },
      })
      .lean()
      .exec();

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    res.status(200).json({
      message: "User added to group successfully",
      data: updatedChat,
    });
  } catch (err) {
    next(err);
  }
};

export const removeFromGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      res.status(400);
      throw new Error("Chat ID and User ID are required");
    }

    const chat = await Chat.findOne({ _id: chatId, users: userId }).lean();
    if (!chat) {
      res.status(400);
      throw new Error("User is not in the group");
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          recentlyRemoved: new Types.ObjectId(userId),
          recentlyAdded: null,
        },
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("recentlyRemoved", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "-password" },
      })
      .exec();

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    res.status(200).json({
      message: "User removed from group successfully",
      data: updatedChat,
    });
  } catch (err) {
    next(err);
  }
};
