import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  addComment, // Import the addComment controller
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addComment); // Add the addComment route

router.delete("/:id", deletePost);

export default router;
