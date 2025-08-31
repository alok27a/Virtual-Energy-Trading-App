import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, Heading, Alert, AlertIcon, Link, Center,
} from '@chakra-ui/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Center h="100vh" bg="gray.800">
      <Box p={8} bg="gray.700" borderWidth={1} borderRadius={8} boxShadow="lg" minW="400px">
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading>Log In</Heading>
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Log In
          </Button>
          <Link as={RouterLink} to="/signup" color="teal.300">
            Don't have an account? Sign up
          </Link>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginPage;
