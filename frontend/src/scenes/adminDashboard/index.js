import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts/admin");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllPosts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLogout = () => {
    localStorage.setItem("isAuth", "false");
    navigate("/admin/login");
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/admin/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      const isAuthenticated = localStorage.getItem("isAuth");

      if (isAuthenticated === "true") {
        localStorage.clear();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/admin/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const lowercaseSearchQuery = searchQuery.toLowerCase();
    const lowercaseFirstName = user.firstName?.toLowerCase() || "";
    const lowercaseLastName = user.lastName?.toLowerCase() || "";
    const lowercaseLocation = user.location?.toLowerCase() || "";
    const lowercaseOccupation = user.occupation?.toLowerCase() || "";
    const lowercaseUserId = user._id?.toLowerCase() || "";

    return (
      lowercaseFirstName.includes(lowercaseSearchQuery) ||
      lowercaseLastName.includes(lowercaseSearchQuery) ||
      lowercaseLocation.includes(lowercaseSearchQuery) ||
      lowercaseOccupation.includes(lowercaseSearchQuery) ||
      lowercaseUserId.includes(lowercaseSearchQuery)
    );
  });

  const filteredPosts = posts.filter((post) => {
    const lowercaseSearchQuery = searchQuery.toLowerCase();
    const lowercaseTitle = post.title?.toLowerCase() || "";
    const lowercaseDescription = post.description?.toLowerCase() || "";
    const lowercaseUserId = post.userId?.toLowerCase() || "";
    const lowercasePostId = post._id?.toLowerCase() || "";

    return (
      lowercaseTitle.includes(lowercaseSearchQuery) ||
      lowercaseDescription.includes(lowercaseSearchQuery) ||
      lowercaseUserId.includes(lowercaseSearchQuery) ||
      lowercasePostId.includes(lowercaseSearchQuery)
    );
  });

  return (
    <Container maxWidth="lg">
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ marginTop: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Users" />
          <Tab label="Posts" />
        </Tabs>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Typography variant="h6">Admin Dashboard</Typography>
        <Box>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            placeholder="Search..."
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {selectedTab === 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            All Users
          </Typography>
          <Grid container spacing={2}>
            {filteredUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={`http://localhost:3001/assets/${user.picturePath}`}
                    alt={`${user.firstName} ${user.lastName}`}
                    sx={{ width: 120, height: 120, marginBottom: 2 }}
                  />
                  <Typography variant="h6" align="center" gutterBottom>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" align="center" gutterBottom>
                    Location: {user.location}
                  </Typography>
                  <Typography variant="body2" align="center" gutterBottom>
                    Occupation: {user.occupation}
                  </Typography>
                  <Typography variant="body2" align="center" gutterBottom>
                    Friends: {user.friends.length}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {selectedTab === 1 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            All Posts
          </Typography>
          <Grid container spacing={2}>
            {filteredPosts.map((post) => (
              <Grid item xs={12} key={post._id}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    width="20%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={
                      post.picturePath
                        ? `http://localhost:3001/assets/${post.picturePath}`
                        : "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"
                    }
                  />
                  <Typography variant="h6" align="center" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" align="center" gutterBottom>
                    Description: {post.description}
                  </Typography>
                  <Typography variant="body2" align="center" gutterBottom>
                    User ID: {post.userId}
                  </Typography>
                  <Typography variant="body2" align="center" gutterBottom>
                    Post ID: {post._id}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;
