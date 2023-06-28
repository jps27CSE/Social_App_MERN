import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  deleteUser,
  getAllUsers,
  deleteUserFromAdmin,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

// DELETE
router.delete("/:id", verifyToken, deleteUser);
router.delete("/admin/:id", deleteUserFromAdmin);

/*GETTING ALL USERS */
router.get("/", getAllUsers);

export default router;
