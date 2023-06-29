import React, { useState } from "react";
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
  TextField,
  Divider,
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

  const [supportForm, setSupportForm] = useState({
    postId: "",
  });

  const handleSupportFormChange = (e) => {
    setSupportForm({
      ...supportForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/posts/admin/issue`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: supportForm.postId,
          issue: supportForm.issue,
          firstName: user.firstName,
          lastName: user.lastName,
          userId: user._id,
        }),
      });

      if (response.ok) {
        toast.success("Issue submitted successfully!", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setSupportForm({
          ...supportForm,
          issue: "",
          postId: "", // Clear the issue field
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Failed to submit issue:", error);
      toast.error(
        error.message || "Failed to submit issue. Please try again.",
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
      );
    }
  };

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

          {/* Support Session */}

          <Box mt={4}>
            <Typography variant="h5" component="h2">
              Support Session
            </Typography>
            <form onSubmit={handleSupportSubmit}>
              <Box mt={2}>
                <TextField
                  name="postId"
                  label="Post ID"
                  value={supportForm.postId}
                  onChange={handleSupportFormChange}
                  fullWidth
                />
              </Box>
              <Box mt={2}>
                <TextField
                  name="issue"
                  label="Write down your issue"
                  value={supportForm.issue}
                  onChange={handleSupportFormChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "1rem" }}
              >
                Submit
              </Button>
            </form>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ProfileSettings;
