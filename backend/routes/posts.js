import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  addComment,
  deleteComment,
  getFeedPostsAdmin,
  deletePostAdmin,
  saveIssue,
  getAllIssues,
  deleteIssue,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/admin", getFeedPostsAdmin);
/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addComment);

/* DELETE */
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment);

router.delete("/:id", deletePost);

router.delete("/admin/:id", deletePostAdmin);

/* ADMIN Issue*/
router.post("/admin/issue", verifyToken, saveIssue);
router.get("/admin/issue/get", getAllIssues);
router.delete("/admin/issues/:id", deleteIssue);
export default router;
