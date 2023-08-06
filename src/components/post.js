import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ListPost({ token, doLogout, user}) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ name: "", body: "" });
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updatedContent, setUpdatedContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [email, setEmail] = useState("");
  const [profilename, setProfilename] = useState("");
  const [photoURL, setPhotoURL] = useState("");


  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const fetchData = async () => {
    console.log("Fetching data...");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/posts/all-posts",
        {},
        { headers }
      );
      console.log("Response Data:", res.data.posts);
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("user : ", user);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log("Headers: " + JSON.stringify(headers));
    try {
      const timestamp = new Date();
      const createPost = {
        ...newPost,
        user : user,
        timestamp: timestamp.toISOString(),
      };
      const res = await axios.post(
        "http://localhost:5000/posts/create-post",
        createPost,
        { headers }
      );
      alert("New post added successfully!");
      setNewPost({ name: "", body: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleDelete = async (idPost) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log("Headers: " + JSON.stringify(headers));
    try {
      const deletePost = {
        id: idPost,
        user: user,
      };
      const res = await axios.post(
        "http://localhost:5000/posts/delete-post",
        deletePost,
        { headers }
      );
      alert("Post deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleUpdate = (post) => {
    setShowUpdateDialog(true);
    setSelectedPost(post);
    setUpdatedContent(post.body);
  };

  const handleUpdateSubmit = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const updatedPost = {
        ...selectedPost,
        body: updatedContent,
        user: user,
      };

      console.log("Updated post: ", updatedPost);
      const res = await axios.post(
        "http://localhost:5000/posts/update-post",
        updatedPost,
        { headers }
      );
      alert("Post updated successfully!");
      setShowUpdateDialog(false);
      setUpdatedContent("");
      window.location.reload();
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleProfile = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {

      console.log("user : ", user);
      const res = await axios.post(
        "http://localhost:5000/profiles/user",
        {
          user : user
        },
        { headers }
      );
      console.log("zap res : ", res.data);
      setEmail(res.data.email);
      setProfilename(res.data.username);
      setPhotoURL(res.data.photoURL);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleUpdateCancel = () => {
    setShowUpdateDialog(false);
    setUpdatedContent("");
  };

  const toggleProfilePopup = () => {
    if (showProfilePopup) {
      setShowProfilePopup(false);
    } else {
      setShowProfilePopup(true);
      handleProfile();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <h1>List Post</h1>
      <button className="btn-topright" onClick={doLogout}>
        Logout
      </button>
      <button className="btn-notso-topright" onClick={toggleProfilePopup}>
        Profile
      </button>
      <div>
        <input
          type="text"
          name="body"
          value={newPost.body}
          onChange={handleInputChange}
          placeholder="Enter content"
        />
        <button onClick={handleSubmit}>Post</button>
      </div>
      {/* Profile Popup Dialog */}
      {showProfilePopup && (
        <div className="modal">
          <div className="modal-content">
            <h2>Profile</h2>
            {/* Add your profile information here */}
            {/* For example: */}
            <img src={photoURL} alt="photo pic" ></img>
            <p>Username: {profilename}</p>
            <p>Email: {email}</p>
            <button onClick={toggleProfilePopup}>Close</button>
          </div>
        </div>
      )}
      {/* Update Popup Dialog */}
      {showUpdateDialog && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Post</h2>
            <input
              type="text"
              name="body"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Enter updated content"
            />
            <button onClick={handleUpdateSubmit}>Update</button>
            <button onClick={handleUpdateCancel}>Cancel</button>
          </div>
        </div>
      )}
      {/* Display posts */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.name}</strong>: {post.body}
            <button onClick={() => handleUpdate(post)}>Update</button>
            <button onClick={() => handleDelete(post.docId)}>Delete</button>
          </li>
        ))}
      </ul>
      
    </div>
  );
}
