"use client";
import React, { useState, useRef } from "react";
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
import fetcher from "../../utils/fetcher";
import Registration from "../../components/categories/registration";

function Register() {
  const formRef = useRef({});
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const router = useRouter();

  const change = (e) => {
    formRef.current[e.target.name] = e.target.value;
  };

  const submit = async () => {
    const formData = { ...formRef.current, sex: value2 };

    try {
      const response = await fetch("http://192.168.1.13:4000/client/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Отправленные данные:", data.id);

      if (data && data.id) {
        router.push(`/patient/${data.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            zIndex={"990"}
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
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  name="surname"
                  onChange={change}
                  required
                  w={"100%"}
                  placeholder="Фамилия"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  name="name"
                  onChange={change}
                  required
                  w={"100%"}
                  placeholder="Имя"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  onChange={change}
                  name="lastName"
                  required
                  w={"100%"}
                  placeholder="Отчество"
                />

                <chakra.span display={"flex"} alignItems={"center"} gap={5}>
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    w={"100%"}
                    name="dateBirth"
                    onChange={change}
                    type="date"
                  />
                  <Text>Пол</Text>
                  <RadioGroup Group onChange={setValue2} value={value2}>
                    <Stack direction="row">
                      <Radio border={"1px solid #000"} value="1">
                        Мужской
                      </Radio>
                      <Radio border={"1px solid #000"} value="0">
                        Женский
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </chakra.span>
                <chakra.span display={"flex"} alignItems={"center"} gap={5}>
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    name="homePhone"
                    onChange={change}
                    w={"100%"}
                    placeholder="Домашний телефон"
                  />
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    name="phoneNumber"
                    onChange={change}
                    w={"100%"}
                    placeholder="Мобильный телефон"
                  />
                  <Checkbox
                    colorScheme="blackAlpha"
                    iconColor="white"
                    sx={{
                      ".chakra-checkbox__control": {
                        borderColor: "black",
                      },
                    }}
                  >
                    <Text color={"#000"}>СМС</Text>
                  </Checkbox>
                </chakra.span>
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="email"
                  onChange={change}
                  placeholder="Email"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  onChange={change}
                  name="socialPlace"
                  placeholder="Социальное положение"
                />
              </Flex>

              <Flex
                mt={"30px"}
                flexDir={"column"}
                w={"auto"}
                alignItems={"flex-start"}
                gap={5}
              >
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="republic"
                  onChange={change}
                  placeholder="Республика"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="region"
                  onChange={change}
                  placeholder="Регион"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="street"
                  onChange={change}
                  placeholder="Район"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="addres"
                  onChange={change}
                  placeholder="Адрес"
                />

                <chakra.span display={"flex"} alignItems={"center"} gap={5}>
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    w={"100%"}
                    name="passportSeries"
                    onChange={change}
                    placeholder="Серия"
                  />
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    w={"100%"}
                    name="passportNum"
                    onChange={change}
                    placeholder="Номер"
                  />
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    w={"100%"}
                    placeholder="Дата выдачи"
                  />
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    w={"100%"}
                    placeholder="Срок годности"
                  />
                </chakra.span>
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="passportGiver"
                  onChange={change}
                  placeholder="Кем выдан"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="work"
                  onChange={change}
                  placeholder="Место работы/учебы"
                />
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
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="discount"
                  onChange={change}
                  placeholder="Скидка"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="benefitCategory"
                  onChange={change}
                  placeholder="Категория льгот"
                />
              </chakra.span>
              <chakra.span
                display={"flex"}
                alignItems={"center"}
                flexDir={"column"}
                gap={5}
              >
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="doctor"
                  onChange={change}
                  placeholder="ФИО врача или номер"
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="doctorId"
                  onChange={change}
                  placeholder="ID Врача"
                />
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
                      <Radio
                        border={"1px solid #000"}
                        onChange={change}
                        name="navigation"
                        value="help"
                      >
                        Экстренная помощь
                      </Radio>
                      <Radio
                        border={"1px solid #000"}
                        onChange={change}
                        name="navigation"
                        value="insurance"
                      >
                        Страхование
                      </Radio>
                      <Radio
                        border={"1px solid #000"}
                        onChange={change}
                        name="navigation"
                        value="history"
                      >
                        Оформление новой истории болезни
                      </Radio>
                    </Stack>
                  </RadioGroup>

                  {/* Инпуты для "Страхование" */}
                  {value === "insurance" && (
                    <Stack mt={3} spacing={2}>
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        placeholder="Компания"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        placeholder="Номер полиса"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        placeholder="Баланс полиса"
                      />
                    </Stack>
                  )}

                  {/* Инпуты для "Оформление новой истории болезни" */}
                  {value === "history" && (
                    <Stack mt={3} spacing={2}>
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        placeholder="Тип карты"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        placeholder="№ Истории болезни"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        placeholder="Дата открытия"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        placeholder="Ответственный врач"
                      />
                    </Stack>
                  )}
                </chakra.div>
              </chakra.span>
            </Flex>

            <Flex px={"100px"} gap={10} w={"100%"} alignItems={"flex-start"}>
              <Registration />
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
                onClick={submit}
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
