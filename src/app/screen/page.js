"use client";

import { useEffect, useState } from "react";
import {
  Flex,
  CircularProgress,
  Button,
  Text,
} from "@chakra-ui/react";
import Compartment from "@/app/components/Compartment";
import InputBox from "@/app/components/InputBox";
import axios from "axios";
import { useRouter } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Screen() {
  const router = useRouter();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth");
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        console.error("Invalid user data in localStorage");
        router.push("/auth");
      }
    }
  
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/seats`);
      setData(response.data.availableSeats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg="#E5E7EB">
        <CircularProgress
          isIndeterminate
          color="blue.400"
          size="50px"
          thickness="12px"
        />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        justify="flex-end"
        align="center"
        w="100%"
        p={4}
        bg="gray.200"
        position="sticky"
        top={0}
        zIndex={1}
      >
        <Text fontWeight="medium" mr={4}>
          {user?.email || "Guest"}
        </Text>
        <Button size="sm" colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

      <Flex
        justify="space-around"
        align="center"
        minH="100vh"
        bg="#E5E7EB"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
        p={4}
      >
        <Compartment data={data} loading={loading} />
        <InputBox fetchData={fetchData} setData={setData} data={data} />
      </Flex>
    </>
  );
}
