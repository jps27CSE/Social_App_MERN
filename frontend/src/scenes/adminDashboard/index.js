import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    // Add logic to handle tab change
  };

  const handleLogout = () => {
    localStorage.setItem("isAuth", "false");
    navigate("/admin/login");
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the deleted user from the users state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ marginTop: 4 }}>
        <Tabs value={0} onChange={handleTabChange} centered>
          <Tab label="Users" />
          <Tab label="Posts" />
        </Tabs>
      </Box>

      {/* Users Page */}
      {0 === 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            All Users
          </Typography>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={12} md={4} key={user._id}>
                <Paper sx={{ p: 2 }}>
                  <img
                    src={`http://localhost:3001/assets/${user.picturePath}`}
                    alt={`${user.firstName} ${user.lastName}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <Typography>
                    {user.firstName} {user.lastName}
                  </Typography>
                  {/* Display other user details here */}
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

      {/* Posts Page */}
      {0 === 1 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            All Posts
          </Typography>
          {/* Display all posts here */}
        </Box>
      )}

      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
