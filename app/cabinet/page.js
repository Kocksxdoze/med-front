"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/med/header";
import Footer from "../../components/med/footer";
import ParticlesComponent from "../../components/med/particles";
import {
  Flex,
  Box,
  Text,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

function Cabinet() {
  const [doctor, setDoctor] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // для выбранной даты
  const [appointments, setAppointments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setDoctor(Array.isArray(decoded) ? decoded[0] : decoded);
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!doctor) return;

    // Уже есть загрузка клиентов...
    setLoadingClients(true);
    fetch("http://192.168.1.13:4000/clients")
      .then((res) => res.json())
      .then((data) => {
        const filteredClients = data.filter(
          (client) => client.doctorId === doctor.id
        );
        setClients(filteredClients);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке клиентов:", err);
      })
      .finally(() => setLoadingClients(false));

    // Загрузка встреч
    setLoadingApps(true);
    fetch("http://192.168.1.13:4000/apps")
      .then((res) => res.json())
      .then((data) => {
        const filteredApps = data.filter((app) => app.doctor === doctor.id);
        setAppointments(filteredApps);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке встреч:", err);
      })
      .finally(() => setLoadingApps(false));
  }, [doctor]);

  // Фильтруем клиентов по выбранной дате (если она выбрана)
  const filteredByDateClients = selectedDate
    ? clients.filter((client) => {
        // предполагаем, что у клиента есть поле date (например: "2025-05-16")
        // надо привести к формату "yyyy-MM-dd" для сравнения
        if (!client.date) return false;
        const clientDate = format(new Date(client.date), "yyyy-MM-dd");
        const selected = format(selectedDate, "yyyy-MM-dd");
        return clientDate === selected;
      })
    : clients;

  return (
    <Flex flexDir="column" pos="absolute" w="100%">
      <Box zIndex="999" pos="relative" px="50px">
        <Header />
      </Box>

      <Box
        position="relative"
        w="full"
        minH="100vh"
        display="flex"
        bgGradient="linear(to-b, black, white)"
        mt={10}
        px="50px"
      >
        <ParticlesComponent />

        <Flex
          zIndex="990"
          w="100%"
          justify="space-between"
          align="stretch"
          gap={6}
        >
          {/* Таблица клиентов слева */}
          <Box
            flex={2}
            bg="whiteAlpha.900"
            p={6}
            borderRadius="2xl"
            boxShadow="lg"
          >
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Мои клиенты
            </Text>
            {loadingClients ? (
              <Spinner size="xl" />
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Имя</Th>
                    <Th>Фамилия</Th>
                    <Th>Отчество</Th>
                    <Th>Тел</Th>
                    <Th>Долг</Th>
                    <Th>Дата</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredByDateClients.length > 0 ? (
                    filteredByDateClients.map((client) => (
                      <Tr key={client.id}>
                        <Td>{client.name}</Td>
                        <Td>{client.surname}</Td>
                        <Td>{client.lastName}</Td>
                        <Td>{client.phoneNumber}</Td>
                        <Td>{client.debt}</Td>
                        <Td>{client.date}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        Клиенты не найдены
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>

          {/* Виджет доктора справа */}
          <Box
            flex={1}
            bg="whiteAlpha.900"
            p={6}
            borderRadius="2xl"
            boxShadow="lg"
            minW="300px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            {doctor ? (
              <>
                <Box>
                  <Flex align="center" gap={4}>
                    <Avatar size="xl" src={doctor.userAvatar} />
                    <Box>
                      <Text fontSize="xl" fontWeight="bold">
                        {doctor.name} {doctor.surname}
                      </Text>
                      <Text color="gray.600">{doctor.profession}</Text>
                    </Box>
                  </Flex>
                  <Box mt={4} display={"flex"} flexDirection={"column"} gap={3}>
                    <Text>
                      <strong>Id:</strong> {doctor.id}
                    </Text>
                    <Text>
                      <strong>Username:</strong> {doctor.username}
                    </Text>
                    <Text>
                      <strong>Email:</strong> {doctor.email}
                    </Text>
                    <Text>
                      <strong>Телефон:</strong> {doctor.phoneNumber}
                    </Text>
                    <Text>
                      <strong>Улица:</strong> {doctor.street}
                    </Text>
                    <Text>
                      <strong>Работа:</strong> {doctor.job}
                    </Text>
                    <Text>
                      <strong>Дата рождения:</strong> {doctor.dateBirth}
                    </Text>
                    <Text>
                      <strong>Роль:</strong> {doctor.role}
                    </Text>
                  </Box>
                </Box>

                {/* Календарь снизу виджета доктора */}
                <Box mt={6} pt={4} borderTop="1px solid #ccc">
                  <Text fontWeight="bold" mb={2}>
                    Фильтр клиентов по дате:
                  </Text>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Выберите дату"
                    isClearable
                  />
                </Box>
                <Box
                  mt={6}
                  pt={4}
                  borderTop="1px solid #eee"
                  maxH="250px"
                  overflowY="auto"
                >
                  <Text fontWeight="bold" mb={2}>
                    Предстоящие встречи
                  </Text>
                  {loadingApps ? (
                    <Spinner size="md" />
                  ) : appointments.length > 0 ? (
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Дата</Th>
                          <Th>Время</Th>
                          <Th>Пациент</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {appointments.map((app) => (
                          <Tr key={app.id}>
                            <Td>{format(new Date(app.date), "yyyy-MM-dd")}</Td>
                            <Td>{format(new Date(app.timeStart), "HH:mm")}</Td>
                            <Td>
                              {app.surname} {app.name}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text>Встречи не найдены</Text>
                  )}
                </Box>
              </>
            ) : (
              <Spinner size="xl" />
            )}
          </Box>
        </Flex>
      </Box>

      <Box pos="relative" mt={"50px"} px="50px" w="100%">
        <Footer />
      </Box>
    </Flex>
  );
}

export default Cabinet;
