import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Button, Box } from '@mui/material';

const Home = () => {
    const { user, logout } = useAuth();

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {user?.username}!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You are successfully logged in.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={logout}
                    sx={{ mt: 2 }}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Home;