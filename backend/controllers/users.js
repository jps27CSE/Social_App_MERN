import User from "../models/User.js";
import Post from "../models/Post.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the user to be deleted
    const deletedUser = await User.findById(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all posts where the deleted user has made comments
    const postsWithUserComments = await Post.find({
      "comments.userId": id,
    });

    // Remove the deleted user's comments from the posts
    const postUpdates = postsWithUserComments.map(async (post) => {
      post.comments = post.comments.filter((comment) => comment.userId !== id);
      await post.save();
    });

    // Wait for all post updates to complete
    await Promise.all(postUpdates);

    // Delete user's posts
    await Post.deleteMany({ userId: id });

    // Remove the user from their friends' friend lists
    const friendPromises = deletedUser.friends.map(async (friendId) => {
      const friend = await User.findById(friendId);
      if (friend) {
        friend.friends = friend.friends.filter(
          (friend) => friend.toString() !== id
        );
        await friend.save();
      }
    });

    // Wait for all friend updates to complete
    await Promise.all(friendPromises);

    // Delete user
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
