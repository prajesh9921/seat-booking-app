"use client";

import { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import Compartment from '@/app/components/Compartment';
import InputBox from '@/app/components/InputBox';
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(false);
    try {
      const response = await axios.get(`${baseURL}/api/seats`);
      console.log(response.data);
      setData(response.data.availableSeats);
      setLoading(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(true);
    }
  };

  return (
    <Flex justify="space-around" align="center" h="100vh" minHeight="fit-content" bg="#E5E7EB">
      <Compartment data={data} loading={loading} />
      <InputBox fetchData={fetchData} setData={setData} data={data} />
    </Flex>
  );
}
