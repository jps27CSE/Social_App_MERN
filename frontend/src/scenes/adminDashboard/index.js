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
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { cyan } from "@mui/material/colors";
import { useTheme } from "@emotion/react";
import { setMode, setLogout } from "state";
import { DarkMode, LightMode } from "@mui/icons-material";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

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

  const fetchAllIssues = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/posts/admin/issue/get"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch issues");
      }

      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllPosts();
    fetchAllIssues();
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
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );

      if (!confirmDelete) {
        return;
      }

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
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );

      if (!confirmDelete) {
        return;
      }

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

  const filteredIssues = issues.filter((issue) => {
    const lowercaseSearchQuery = searchQuery.toLowerCase();
    const lowercaseIssueId = issue._id?.toLowerCase() || "";
    const lowercaseTitle = issue.title?.toLowerCase() || "";
    const lowercaseDescription = issue.description?.toLowerCase() || "";
    const lowercaseStatus = issue.status?.toLowerCase() || "";

    return (
      lowercaseIssueId.includes(lowercaseSearchQuery) ||
      lowercaseTitle.includes(lowercaseSearchQuery) ||
      lowercaseDescription.includes(lowercaseSearchQuery) ||
      lowercaseStatus.includes(lowercaseSearchQuery)
    );
  });

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleDeleteButtonClick = async (issueId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/admin/issues/${issueId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Issue deleted successfully");

        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error deleting issue:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting issue:", error.message);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/admin/suspend/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, is_suspend: true } : user
          )
        );

        window.location.reload();

        localStorage.clear();
      } else {
        const errorData = await response.json();
        console.error("Error suspending user:", errorData.message);
      }
    } catch (error) {
      console.error("Error suspending user:", error.message);
    }
  };

  return (
    <Container maxWidth="lg">
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard{" "}
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }} />
          ) : (
            <LightMode sx={{ color: dark, fontSize: "25px" }} />
          )}
        </IconButton>
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Users" />
          <Tab label="Posts" />
          <Tab label="Issues" />
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
        <Typography variant="h6"> Dashboard</Typography>
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
                  <div>
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
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    <Button
                      variant="contained"
                      color={user.is_suspend ? "success" : "warning"}
                      onClick={() => handleSuspendUser(user._id)}
                      sx={{ marginRight: 1 }}
                    >
                      {user.is_suspend ? "Active" : "Suspend"}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </div>
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
      {selectedTab === 2 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            All Issues
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              {filteredIssues.map((issue) => (
                <Paper
                  key={issue._id}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor:
                      selectedIssue && selectedIssue._id === issue._id
                        ? "grey"
                        : "inherit",
                  }}
                  onClick={() => handleIssueClick(issue)}
                >
                  <Typography variant="body1">
                    {issue.firstName + " " + issue.lastName}{" "}
                    {`(${issue.userId})`}
                  </Typography>
                </Paper>
              ))}
            </Grid>
            <Grid item xs={8}>
              {selectedIssue && (
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Issue User ID: {selectedIssue.userId}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Issue User Name:{" "}
                    {selectedIssue.firstName + " " + selectedIssue.lastName}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Issue Post ID: {selectedIssue.postId}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Description:
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
                    value={selectedIssue.issue}
                    disabled
                  />
                  <Button
                    variant="contained"
                    sx={{
                      color: "black",
                      backgroundColor: cyan[500],
                      marginTop: "1rem",
                    }}
                    onClick={() => handleDeleteButtonClick(selectedIssue._id)}
                    endIcon={<CheckCircleOutlineIcon />}
                  >
                    Solved
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      {showConfirmation && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to perform this search?
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;
