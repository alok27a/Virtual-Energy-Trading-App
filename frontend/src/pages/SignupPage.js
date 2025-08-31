import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, Heading, Alert, AlertIcon, Link, Center, useToast,
} from '@chakra-ui/react';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password);
      toast({
        title: 'Account created.',
        description: "Please log in with your new credentials.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Center h="100vh" bg="gray.800">
      <Box p={8} bg="gray.700" borderWidth={1} borderRadius={8} boxShadow="lg" minW="400px">
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading>Sign Up</Heading>
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
            Sign Up
          </Button>
          <Link as={RouterLink} to="/login" color="teal.300">
            Already have an account? Log in
          </Link>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignupPage;
