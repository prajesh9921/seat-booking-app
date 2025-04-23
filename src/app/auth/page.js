"use client"

import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Link,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const url = baseURL + (isLogin ? '/api/seats/login' : '/api/seats/signup');
      console.log("baseurl", url);
      
      const response = await axios.post(url, { email, password });

      if (isLogin) {
        const token = response.data.token;
        const email = response.data.email;
        toast({
          title: 'Login successful!',
          description: 'Token received',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/screen')
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email }));
      } else {
        toast({
          title: 'Signup successful!',
          description: 'You can now login.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsLogin(true);
      }
    } catch (error) {
      console.log(error);
      
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Something went wrong!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };



  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100" px={4}>
      <Box
        bg="white"
        px={{ base: 6, md: 10 }}
        py={{ base: 8, md: 10 }}
        rounded="lg"
        shadow="md"
        w="full"
        maxW="sm"
      >
        <Heading
          mb={6}
          textAlign="center"
          fontSize={{ base: '2xl', md: '3xl' }}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Heading>

        <Stack spacing={4}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleSubmit}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </Stack>

        <Text mt={4} textAlign="center" fontSize={{ base: 'sm', md: 'md' }}>
          {isLogin ? 'New here?' : 'Already have an account?'}{' '}
          <Link color="blue.500" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default AuthPage;
