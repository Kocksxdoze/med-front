"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Heading,
  chakra,
  Radio,
  Checkbox,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import Header from "../../components/med/header";
import Footer from "../../components/med/footer";
import ParticlesComponent from "../../components/med/particles";
import { useRouter } from "next/navigation";

function Register() {
  const [value, setValue] = useState("");
  const router = useRouter();
  return (
    <>
      <Box pos={"absolute"} w={"100%"}>
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
          flexDir={"column"}
          px={"50px"}
          bgGradient="linear(to-b, black, white)"
        >
          <ParticlesComponent />

          <Box
            shadow={"2xl"}
            zIndex={"999"}
            w={"100%"}
            h={"100%"}
            bg={"#fff"}
            mx={"50px"}
            px={"30px"}
            py={"30px"}
            mt={"50px"}
            borderRadius={"16px"}
          >
            <Heading>Добавление пациента</Heading>

            <Box
              display={"flex"}
              justifyContent={"space-between"}
              px={"100px"}
              gap={10}
            >
              <Flex
                mt={"30px"}
                flexDir={"column"}
                w={"auto"}
                alignItems={"flex-start"}
                gap={5}
              >
                <Input required w={"100%"} placeholder="Фамилия" />
                <Input required w={"100%"} placeholder="Имя" />
                <Input required w={"100%"} placeholder="Отчество" />

                <chakra.span display={"flex"} alignItems={"center"} gap={5}>
                  <Input w={"100%"} type="date" />
                  <Text>Пол</Text>
                  <Radio>Мужской</Radio>
                  <Radio>Женский</Radio>
                </chakra.span>
                <chakra.span display={"flex"} alignItems={"center"} gap={5}>
                  <Input w={"100%"} placeholder="Домашний телефон" />
                  <Input w={"100%"} placeholder="Мобильный телефон" />
                  <Checkbox>СМС</Checkbox>
                </chakra.span>
                <Input w={"100%"} placeholder="Email" />
                <Input w={"100%"} placeholder="Социальное положение" />
              </Flex>

              <Flex
                mt={"30px"}
                flexDir={"column"}
                w={"auto"}
                alignItems={"flex-start"}
                gap={5}
              >
                <Input w={"100%"} placeholder="Республика" />
                <Input w={"100%"} placeholder="Регион" />
                <Input w={"100%"} placeholder="Район" />
                <Input w={"100%"} placeholder="Адрес" />

                <chakra.span display={"flex"} alignItems={"center"} gap={5}>
                  <Input w={"100%"} placeholder="Серия" />
                  <Input w={"100%"} placeholder="Номер" />
                  <Input w={"100%"} placeholder="Дата выдачи" />
                  <Input w={"100%"} placeholder="Срок годности" />
                </chakra.span>
                <Input w={"100%"} placeholder="Кем выдан" />
                <Input w={"100%"} placeholder="Место работы/учебы" />
              </Flex>
            </Box>

            <Flex
              mt={"50px"}
              px={"100px"}
              gap={10}
              w={"100%"}
              alignItems={"flex-start"}
            >
              <chakra.span
                display={"flex"}
                alignItems={"center"}
                flexDir={"column"}
                gap={5}
              >
                <Input w={"100%"} placeholder="Скидка" />
                <Input w={"100%"} placeholder="Категория льгот" />
              </chakra.span>
              <chakra.span
                display={"flex"}
                alignItems={"center"}
                flexDir={"column"}
                gap={5}
              >
                <Input w={"100%"} placeholder="ФИО врача или номер" />
                <Input w={"100%"} placeholder="ID Врача" />
              </chakra.span>
              <chakra.span
                display={"flex"}
                alignItems={"flex-start"}
                flexDir={"column"}
                gap={5}
              >
                <Text>Имеются ли у вас направления?</Text>
                <chakra.div>
                  {/* Группа радиокнопок */}
                  <RadioGroup onChange={setValue} value={value}>
                    <Stack direction="row" spacing={5}>
                      <Radio value="help">Экстренная помощь</Radio>
                      <Radio value="insurance">Страхование</Radio>
                      <Radio value="history">
                        Оформление новой истории болезни
                      </Radio>
                    </Stack>
                  </RadioGroup>

                  {/* Инпуты для "Страхование" */}
                  {value === "insurance" && (
                    <Stack mt={3} spacing={2}>
                      <Input placeholder="Компания" />
                      <Input placeholder="Номер полиса" />
                      <Input placeholder="Баланс полиса" />
                    </Stack>
                  )}

                  {/* Инпуты для "Оформление новой истории болезни" */}
                  {value === "history" && (
                    <Stack mt={3} spacing={2}>
                      <Input placeholder="Тип карты" />
                      <Input placeholder="№ Истории болезни" />
                      <Input placeholder="Дата открытия" />
                      <Input placeholder="Ответственный врач" />
                    </Stack>
                  )}
                </chakra.div>
              </chakra.span>
            </Flex>

            <Flex
              alignItems={"center"}
              gap={3}
              mt={"50px"}
              px={"100px"}
              justifyContent={"flex-end"}
              onClick={() => router.push("/patients")}
            >
              <Button border={"1px solid transparent"}>
                Вернуться к списку
              </Button>
              <Button
                bg={"#0253b4"}
                color={"white"}
                border={"1px solid transparent"}
                _hover={{
                  bg: "transparent",
                  color: "#000",
                  border: "1px solid #0253b4",
                }}
              >
                Добавить
              </Button>
            </Flex>
          </Box>
          <Box pos={"relative"} mt={"50px"} w={"100%"}>
            <Footer />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Register;
