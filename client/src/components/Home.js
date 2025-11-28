import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import apiClient from '../utils/api';

const Home = () => {
    const { user, logout, loading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.token) {
                setProfileLoading(true);
                setProfileError('');
                try {
                    const response = await apiClient.get('/users/profile');
                    setProfile(response.data);
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    setProfileError('Failed to load profile information');
                } finally {
                    setProfileLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {profile?.username || user?.username}!
                </Typography>
                {profileError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {profileError}
                    </Alert>
                )}
                {profileLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Typography variant="body1" gutterBottom>
                            You are successfully logged in.
                        </Typography>
                        {profile && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Email:</strong> {profile.email}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
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