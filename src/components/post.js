import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ListPost({ token, doLogout, username }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ name: "", body: "" });

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
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log("Headers: " + JSON.stringify(headers));
    try {
      const timestamp = new Date();
      const updatedPost = {
        ...newPost,
        name: username, //get the username of email
        timestamp: timestamp.toISOString(),
      };
      const res = await axios.post(
        "http://localhost:5000/posts/create-post",
        updatedPost,
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
        id : idPost,
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



  return (
    <div style={{ position: "relative" }}>
      <h1>List Post</h1>
      <button className="btn-topright" onClick={doLogout}>
        Logout
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
      {/* Display posts */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.name}</strong>: {post.body}
            {/* <button onClick={() => handleUpdate(post)}>Update</button> */}
            <button onClick={() => handleDelete(post.docId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
