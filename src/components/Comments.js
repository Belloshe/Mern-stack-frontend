import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; 
import useSWR, { mutate } from 'swr';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const fetcher = url => axiosInstance.get(url).then(res => res.data);

function Comments({ postId }) {
  const { data: comments, error } = useSWR(`/api/posts/${postId}/comments`, fetcher);
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');

  if (error) return <div>Failed to load comments</div>;
  if (!comments) return <div>Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.post(`/api/posts/${postId}/comments`, { body }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      mutate(`/api/posts/${postId}/comments`);
      setBody('');
      setMessage('Comment added successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + err.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.delete(`/api/comments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      mutate(`/api/posts/${postId}/comments`);
      setMessage('Comment deleted successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + err.response.data.message);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Comments</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Add a comment"
          multiline
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          Add Comment
        </Button>
      </Box>
      {message && <Typography variant="body2" color="error">{message}</Typography>}
      <List>
        {comments.map(comment => (
          <Paper elevation={2} sx={{ mb: 1 }} key={comment._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={comment.body}
                secondary={
                  <Typography component="span" variant="body2" color="textPrimary">
                    By: {comment.user.username}
                  </Typography>
                }
              />
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(comment._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
}

export default Comments;
