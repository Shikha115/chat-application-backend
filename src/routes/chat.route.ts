import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  updateById,
} from "@/controllers/chat.controller";
import { protect } from "@/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.route("/").get(protect, fetchChats).post(protect, accessChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename/:id").patch(protect, updateById); // rename group
router.route("/groupremove").patch(protect, removeFromGroup); // remove someone from group
router.route("/groupadd").patch(protect, addToGroup); // add someone to group

export default router;
