import mongoose from "mongoose";

const AdminSchema = mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
