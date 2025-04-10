"use client";

import { Button, Flex, Input, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import Seat from '@/app/components/Seat'
import axios from 'axios';

export default function InputBox({ fetchData }) {

    // State variables
    const [numberOfSeat, setNumberOfSeat] = useState();
    const [axiosResponse, setAxiosResponse] = useState();
    const [bookingProcessing, setBookingProcessing] = useState(false);
    const [resetBookingProcessing, setResetBookingProcessing] = useState(false);
    const toast = useToast();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    function displayToast(status, message) {
        toast({
            title: message,
            status: status,
            duration: 3000,
            isClosable: true,
        })
    }

    // handel ticket booking 
    function handelBookTicket() {
        if (numberOfSeat > 7) {
            displayToast("error", "Only allow to book 7 seats at a time");
        }
        else if (!numberOfSeat || numberOfSeat <= 0) {
            displayToast("error", "Enter a valid booking number");
        }
        else {
            handelAxiosPost()
        }
    }


    //  Makes request to book seats.
    const handelAxiosPost = async () => {
        setBookingProcessing(true)
        try {
            const response = await axios.post(`${baseURL}/api/seats/book`, { numOfSeats: numberOfSeat });
            setAxiosResponse(response.data.data)
            fetchData()
            displayToast("success", "Seat successfully booked")
            setBookingProcessing(false)

        } catch (error) {
            console.error('Error fetching data:', error);
            displayToast("error", error.response.data.message)

            setBookingProcessing(false)

        }
    };

    // reset booking
    const handelResetBooking = async () => {

        setResetBookingProcessing(true)

        try {
            const response = await axios.post(`${baseURL}/api/seats`);
            console.log(response.data)
            fetchData()
            setResetBookingProcessing(false)
            setAxiosResponse();
            displayToast("success", "Booking successfully reset.")

        } catch (error) {
            console.error('Error fetching data:', error);
            setResetBookingProcessing(false)
        }
    };


    return (
        <VStack align={"left"} >
            <Flex gap="2" align={"center"} >
                <Text as="b" fontSize={"md"}  > Book Seats </Text>
                {axiosResponse?.map((item) => (
                    <Seat key={item.id} isBooked={true} seatNumber={item.seatnumber} />
                ))}
            </Flex>

            <Flex gap="2">
                <Input disabled={bookingProcessing || resetBookingProcessing} bg="white" color="blue.600" placeholder='Enter number of seats.' border={"1px solid"} onChange={(e) => { setNumberOfSeat(parseInt(e.target.value)) }} type='number' />
                <Button isDisabled={bookingProcessing || resetBookingProcessing} w="fit-content" px="10" colorScheme='blue' border={"1px solid"} onClick={(e) => { handelBookTicket() }} isLoading={bookingProcessing}
                    loadingText={bookingProcessing ? " Please Wait " : ""}
                    variant={bookingProcessing ? "outline" : "solid"}
                > Book </Button>
            </Flex>

            <Button isDisabled={bookingProcessing || resetBookingProcessing} border={"1px solid"} w="full" mt="2" colorScheme='blue' onClick={(e => { handelResetBooking() })} isLoading={resetBookingProcessing}
                loadingText={resetBookingProcessing ? "Please Wait" : ""}
                variant={resetBookingProcessing ? "outline" : "solid"}
            > Reset Booking </Button>
        </VStack>
    )
}
