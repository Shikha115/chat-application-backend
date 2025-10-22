import express from "express";
import userRoute from "@routes/user.route";
import messageRoute from "@routes/message.route";
import chatRoute from "@routes/chat.route";

const router = express.Router();

router.use("/users", userRoute);
router.use("/message", messageRoute);
router.use("/chat", chatRoute);


export default router;