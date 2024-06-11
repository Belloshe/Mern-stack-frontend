import React, { useState } from 'react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import Comments from './Comments';
import { TextField, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const fetcher = url => axios.get(url).then(res => res.data);

function Posts() {
  const { data: posts, error } = useSWR('/api/posts', fetcher);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  if (error) return <div>Failed to load posts</div>;
  if (!posts) return <div>Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editing) {
        await axios.put(`/api/posts/${editing}`, { title, body }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        mutate('/api/posts');
        setEditing(null);
        setMessage('Post updated successfully!');
      } else {
        await axios.post('/api/posts', { title, body }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        mutate('/api/posts');
        setMessage('Post added successfully!');
      }
      setTitle('');
      setBody('');
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + (err.response ? err.response.data.message : 'Server error'));
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditing(post._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      console.log('Attempting to delete post with ID:', id);
      await axios.delete(`/api/posts/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      mutate('/api/posts');
      setMessage('Post deleted successfully!');
    } catch (err) {
      console.error('Error deleting post:', err);
      setMessage('Error: ' + (err.response ? err.response.data.message : 'Server error'));
    }
  };

  const handleUpvote = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/posts/${id}/upvote`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      mutate('/api/posts');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/posts/${id}/downvote`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      mutate('/api/posts');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Posts
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, mb: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Body"
            multiline
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {editing ? 'Update Post' : 'Add Post'}
          </Button>
        </Box>
        {message && <Typography variant="body2" color="error" sx={{ mt: 2 }}>{message}</Typography>}
        <Grid container spacing={3}>
          {posts.map(post => (
            <Grid item xs={12} key={post._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {post.body}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    By: {post.user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Votes: {post.votes}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="edit" onClick={() => handleEdit(post)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(post._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton aria-label="upvote" onClick={() => handleUpvote(post._id)}>
                    <ThumbUpIcon />
                  </IconButton>
                  <IconButton aria-label="downvote" onClick={() => handleDownvote(post._id)}>
                    <ThumbDownIcon />
                  </IconButton>
                </CardActions>
                <Comments postId={post._id} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Posts;
