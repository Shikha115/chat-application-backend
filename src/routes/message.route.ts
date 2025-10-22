




import { allMessages, sendMessage } from "@/controllers/message.controller";
import { protect } from "@/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.route("/:chatId").get(protect, allMessages); //fetch all messages of a chat
router.route("/").post(protect, sendMessage); //send message

export default router;