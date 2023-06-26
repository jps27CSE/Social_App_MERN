import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDeleteUser } from "state";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Navbar from "scenes/navbar";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const { picturePath } = useSelector((state) => state.user);

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile?"
    );

    if (confirmed) {
      fetch(`http://localhost:3001/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            dispatch(setDeleteUser());
            history.push("/");
          } else {
            throw new Error("Failed to delete user");
          }
        })
        .catch((error) => {
          console.error("Failed to delete user:", error);
        });
    }
  };

  return (
    <>
      {" "}
      <Navbar />
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: "2rem" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" component="h1">
              Profile Settings
            </Typography>
          </Box>
          <Box my={2}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                alt="Profile Picture"
                src={`http://localhost:3001/assets/${picturePath}`}
                sx={{ mr: 2 }}
              />
              <Typography variant="h6" component="h2">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Occupation: {user.occupation}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Location: {user.location}
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleDelete}>
            Delete Profile
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default ProfileSettings;
