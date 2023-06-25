import {
  ChatBubbleOutlineOutlined,
  DeleteOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  TextField,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments = [],
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = likes && Boolean(likes[loggedInUserId]);
  const [updatedComments, setUpdatedComments] = useState(comments);

  const likeCount = likes ? Object.keys(likes).length : 0;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmed) {
        return;
      }
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Reload the feed posts after deleting the post
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            comment: commentText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const { updatedPost } = await response.json();
      setUpdatedComments(updatedPost.comments);
      window.location.reload();
      setCommentText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (!confirmed) {
        return;
      }

      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      const updatedPost = await response.json();
      setUpdatedComments(updatedPost.comments);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>

            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {postUserId === loggedInUserId && (
          <IconButton onClick={handleDelete}>
            <DeleteOutlined />
          </IconButton>
        )}
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {updatedComments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <FlexBetween alignItems="center">
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment.comment}
                </Typography>
                {comment.userId === loggedInUserId && (
                  <IconButton onClick={() => handleDeleteComment(comment._id)}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
          ))}
          <Divider />
          <form onSubmit={handleCommentSubmit}>
            <TextField
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              label="Add a comment"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
            />
            <IconButton type="submit">
              <SendOutlined />
            </IconButton>
          </form>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
