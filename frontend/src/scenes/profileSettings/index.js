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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Navbar from "scenes/navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const { picturePath } = useSelector((state) => state.user);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile?"
    );

    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          dispatch(setDeleteUser());
          history("/"); // Use navigate instead of history.push
          toast.success("Profile deleted successfully!", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }); // Show success toast
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error(
          error.message || "Failed to delete user. Please try again.",
          {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        ); // Show error toast
      }
    }
  };

  return (
    <>
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
