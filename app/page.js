"use client";
import React from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import ParticlesComponent from "../components/med/particles";
import Header from "../components/med/header";
import Footer from "../components/med/footer";

function Main() {
  return (
    <Flex flexDir={"column"} pos={"absolute"} w={"100%"}>
      <Box zIndex="999" pos={"relative"} px={"50px"}>
        <Header />
      </Box>
      <Box
        position="relative"
        w="full"
        bgColor={"white.500"}
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-b, black, white)"
      >
        <ParticlesComponent />
        <Flex
          mt={"30px"}
          gap={5}
          w={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Пациенты
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            История кассы
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Отчет по лаб
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Отчет по врачам
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Отчет по услугам
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Зарплата
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Карты
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Сертификаты
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Врачи
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Компании
          </Button>
          <Button
            fontWeight={"500"}
            w={"auto"}
            bg={"white"}
            borderRadius={"8px"}
          >
            Пользователи
          </Button>
        </Flex>
      </Box>
      <Box pos={"relative"} bottom={"0"} px={"50px"} mt={"50px"} w={"100%"}>
        <Footer />
      </Box>
    </Flex>
  );
}

export default Main;
