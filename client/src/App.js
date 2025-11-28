import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MERN App
        </Typography>
        {user ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Container component="main" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;