import {
  getAllData,
  authUser,
  registerUser,
  deleteById,
  deleteAllData,
  getByName,
  getCurrentUser,
  getById,
} from "@/controllers/user.controller";
import express from "express";
import { upload } from "@/config/multer.config";
import { protect } from "@/middlewares/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(getAllData)
  .post(upload.single("pic"), registerUser)
  .delete(deleteAllData);
router.route("/getCurrentUser").get(protect, getCurrentUser);
router.route("/:id").delete(deleteById).get(getById);
router.route("/getByName/:search").get(protect, getByName);
router.post("/login", authUser);

export default router;
