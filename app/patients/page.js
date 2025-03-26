"use client";
import React from "react";
import Header from "../../components/med/header";
import Footer from "../../components/med/footer";
import Patients from "../../components/med/patients";
import ParticlesComponent from "../../components/med/particles";
import { Box, Flex } from "@chakra-ui/react";

function PatientsPage() {
  return (
    <>
      <Flex flexDir={"column"} pos={"absolute"} w={"100%"}>
        <Box zIndex="999" pos={"relative"} px={"50px"}>
          <Header />
        </Box>
        <Box
          position="relative"
          w="full"
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgGradient="linear(to-b, black, white)"
        >
          <ParticlesComponent />
          <Box zIndex={"999"}>
            <Patients />
          </Box>
        </Box>
        <Box pos={"relative"} bottom={"0"} px={"50px"} mt={"50px"} w={"100%"}>
          <Footer />
        </Box>
      </Flex>
    </>
  );
}

export default PatientsPage;
