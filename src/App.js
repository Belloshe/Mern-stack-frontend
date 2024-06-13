import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, Button, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Auth from './components/Auth';
import Posts from './components/Posts';

const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Simplified Version Of Reddit
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 7,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {isAuthenticated ? (
            <Posts />
          ) : (
            <Auth setIsAuthenticated={setIsAuthenticated} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
