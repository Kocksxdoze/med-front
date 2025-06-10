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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Checkbox,
  useDisclosure,
  Input,
  useToast,
  Select,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, startOfDay, parseISO } from "date-fns";

import { getApiBaseUrl } from "../../utils/api";

function Cabinet() {
  const [doctor, setDoctor] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // для выбранной даты
  const [appointments, setAppointments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const toast = useToast();
  const api = getApiBaseUrl();
  const [selectedClient, setSelectedClient] = useState(null);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const [diagnosisText, setDiagnosisText] = useState(""); // for doctor
  const [labAnalysis, setLabAnalysis] = useState(""); // for lab
  const [isReady, setIsReady] = useState(false); // for lab
  const [selectedDiagnosisIndex, setSelectedDiagnosisIndex] = useState(0);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState(null);
  const [offersText, setOffersText] = useState("");
  const [saveTarget, setSaveTarget] = useState("diagnosis");
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [selectedLabIndex, setSelectedLabIndex] = useState(0);
  const [selectedLabId, setSelectedLabId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        const user = Array.isArray(decoded) ? decoded[0] : decoded;
        setDoctor(user);
        setUserRole(user.role);
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!doctor) return;

    // Уже есть загрузка клиентов...
    setLoadingClients(true);
    fetch(`${api}/clients`)
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
    fetch(`${api}/apps`)
      .then((res) => res.json())
      .then((data) => {
        const filteredApps = data.filter((app) => app.doctor === doctor.id);

        // получаем сегодняшнюю дату с обнулённым временем
        const today = startOfDay(new Date());

        // фильтруем встречи: дата встречи >= сегодня (игнорируем время)
        const upcoming = filteredApps.filter((app) => {
          // app.date — формат 'yyyy-MM-dd', если ISO, parseISO подойдет
          const appDate = startOfDay(parseISO(app.date));
          return appDate >= today;
        });

        setAppointments(upcoming);
        setUpcomingAppointments(upcoming);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке встреч:", err);
      })
      .finally(() => setLoadingApps(false));
  }, [doctor]);

  const filteredByDateClients = selectedDate
    ? clients.filter((client) => {
        if (!client.date) return false;
        const clientDate = format(
          parse(client.date, "yyyy-MM-dd HH:mm:ss", new Date()),
          "yyyy-MM-dd"
        );
        const selected = format(selectedDate, "yyyy-MM-dd");
        return clientDate === selected;
      })
    : clients;

  const handleOpenModal = (client) => {
    setSelectedClient(client);

    if (userRole === "laboratory") {
      if (client.lab && client.lab.length > 0) {
        setSelectedLabIndex(0);
        setSelectedLabId(client.lab[0].id);
        setLabAnalysis(client.lab[0].analise || "");
        setIsReady(client.lab[0].ready || false);
      } else {
        setSelectedLabIndex(null);
        setSelectedLabId(null);
        setLabAnalysis("");
        setIsReady(false);
      }
    } else {
      // Инициализация для врачей
      if (client.diagnostics && client.diagnostics.length > 0) {
        setSelectedDiagnosisIndex(0);
        setSelectedDiagnosisId(client.diagnostics[0].id);
        setDiagnosisText(client.diagnostics[0].about || "");
      } else {
        setSelectedDiagnosisIndex(null);
        setSelectedDiagnosisId(null);
        setDiagnosisText("");
      }

      if (client.offers && client.offers.length > 0) {
        setSelectedOfferId(client.offers[0].id);
        setOffersText(client.offers[0].about || "");
      } else {
        setSelectedOfferId(null);
        setOffersText("");
      }
    }

    openModal();
  };

  const handleSave = () => {
    let endpoint = "";
    let payload = {};

    if (userRole === "laboratory") {
      if (!selectedLabId) {
        toast({
          title: "Ошибка",
          description: "Выберите анализ для редактирования",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      endpoint = `${api}/lab/update/${selectedLabId}`;
      payload = { analise: labAnalysis, ready: isReady };
    } else {
      if (!saveTarget) {
        toast({
          title: "Ошибка",
          description: "Укажите, что сохранять: диагностику или услугу",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (saveTarget === "diagnosis") {
        if (!selectedDiagnosisId) {
          toast({
            title: "Ошибка",
            description: "Выберите диагностику для редактирования",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        endpoint = `${api}/dia/update/${selectedDiagnosisId}`;
        payload = { about: diagnosisText };
      } else if (saveTarget === "offer") {
        if (!selectedOfferId) {
          toast({
            title: "Ошибка",
            description: "Выберите услугу для редактирования",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        endpoint = `${api}/offer/update/${selectedOfferId}`;
        payload = { about: offersText };
      }
    }

    fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при обновлении данных");
        return res.text();
      })
      .then(() => {
        toast({
          title:
            userRole === "laboratory"
              ? "Анализ сохранён"
              : saveTarget === "diagnosis"
              ? "Диагностика сохранена"
              : "Услуга сохранена",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        closeModal();
        return fetch(`${api}/clients`)
          .then((res) => res.json())
          .then((data) => {
            const filteredClients = data.filter(
              (client) => client.doctorId === doctor.id
            );
            setClients(filteredClients);
          });
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        toast({
          title: "Ошибка при сохранении",
          description: err.message || "Что-то пошло не так",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };
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
                    <Th>Дата</Th>
                    <Th>Действие</Th>
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
                        <Td>{client.dateBirth}</Td>
                        <Td>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleOpenModal(client)}
                          >
                            {userRole === "laboratory"
                              ? "Анализ"
                              : "Заключение"}
                          </Button>
                        </Td>
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
                  ) : upcomingAppointments.length > 0 ? (
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Дата</Th>
                          <Th>Время</Th>
                          <Th>Пациент</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {upcomingAppointments.map((app) => (
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
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {userRole === "laboratory"
                ? "Анализ пациента"
                : "Заключение врача"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {userRole === "laboratory" ? (
                <>
                  {selectedClient?.lab?.length > 1 && (
                    <Box mb={4}>
                      <Text fontWeight="bold" mb={1}>
                        Выберите анализ:
                      </Text>
                      <Select
                        value={selectedLabIndex}
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          setSelectedLabIndex(idx);
                          const lab = selectedClient.lab[idx];
                          setSelectedLabId(lab.id);
                          setLabAnalysis(lab.analise || "");
                          setIsReady(lab.ready || false);
                        }}
                      >
                        {selectedClient.lab.map((l, i) => (
                          <option key={l.id} value={i}>
                            {`#${i + 1} - ${l.analise?.slice(0, 30)}...`}
                          </option>
                        ))}
                      </Select>
                    </Box>
                  )}
                  <Textarea
                    placeholder="Введите анализ..."
                    value={labAnalysis}
                    onChange={(e) => setLabAnalysis(e.target.value)}
                    mb={4}
                  />
                  <Checkbox
                    isChecked={isReady}
                    onChange={(e) => setIsReady(e.target.checked)}
                  >
                    Готово
                  </Checkbox>

                  {selectedLabId &&
                    selectedClient?.lab?.find((l) => l.id === selectedLabId)
                      ?.analise && (
                      <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                        <Text fontWeight="bold" mb={1}>
                          Предыдущий анализ:
                        </Text>
                        <Text whiteSpace="pre-wrap">
                          {
                            selectedClient.lab.find(
                              (l) => l.id === selectedLabId
                            ).analise
                          }
                        </Text>
                      </Box>
                    )}
                </>
              ) : (
                <>
                  <Box mb={4}>
                    <Text fontWeight="bold">
                      Выберите, что хотите сохранить:
                    </Text>
                    <Flex gap={4} mt={2}>
                      <Button
                        size="sm"
                        colorScheme={
                          saveTarget === "diagnosis" ? "blue" : "gray"
                        }
                        onClick={() => setSaveTarget("diagnosis")}
                      >
                        Диагностика
                      </Button>
                      <Button
                        size="sm"
                        colorScheme={saveTarget === "offer" ? "blue" : "gray"}
                        onClick={() => setSaveTarget("offer")}
                      >
                        Услуга
                      </Button>
                    </Flex>
                  </Box>

                  {saveTarget === "diagnosis" && (
                    <>
                      {selectedClient?.diagnostics?.length > 1 && (
                        <Box mb={4}>
                          <Text fontWeight="bold" mb={1}>
                            Выберите диагностику:
                          </Text>
                          <Select
                            value={selectedDiagnosisIndex}
                            onChange={(e) => {
                              const idx = Number(e.target.value);
                              setSelectedDiagnosisIndex(idx);
                              const dia = selectedClient.diagnostics[idx];
                              setSelectedDiagnosisId(dia.id);
                              setDiagnosisText(dia.about || "");
                            }}
                          >
                            {selectedClient.diagnostics.map((d, i) => (
                              <option key={d.id} value={i}>
                                {`#${i + 1} - ${d.name?.slice(0, 30)}...`}
                              </option>
                            ))}
                          </Select>
                        </Box>
                      )}
                      <Textarea
                        placeholder="Введите текст заключения..."
                        value={diagnosisText}
                        onChange={(e) => setDiagnosisText(e.target.value)}
                        mb={4}
                      />

                      {selectedDiagnosisId &&
                        selectedClient?.diagnostics?.find(
                          (d) => d.id === selectedDiagnosisId
                        )?.about && (
                          <Box p={3} bg="gray.50" borderRadius="md">
                            <Text fontWeight="bold" mb={1}>
                              Предыдущее заключение:
                            </Text>
                            <Text whiteSpace="pre-wrap">
                              {
                                selectedClient.diagnostics.find(
                                  (d) => d.id === selectedDiagnosisId
                                ).about
                              }
                            </Text>
                          </Box>
                        )}
                    </>
                  )}

                  {saveTarget === "offer" && (
                    <>
                      {selectedClient?.offers?.length > 1 && (
                        <Box mb={4}>
                          <Text fontWeight="bold" mb={1}>
                            Выберите услугу:
                          </Text>
                          <Select
                            value={selectedOfferId}
                            onChange={(e) => {
                              const id = Number(e.target.value);
                              const offer = selectedClient.offers.find(
                                (o) => o.id === id
                              );
                              setSelectedOfferId(id);
                              setOffersText(offer?.about || "");
                            }}
                          >
                            {selectedClient.offers.map((o) => (
                              <option key={o.id} value={o.id}>
                                {`#${o.id} - ${o.name?.slice(0, 30)}...`}
                              </option>
                            ))}
                          </Select>
                        </Box>
                      )}
                      <Textarea
                        placeholder="Введите текст услуги..."
                        value={offersText}
                        onChange={(e) => setOffersText(e.target.value)}
                        mb={4}
                      />

                      {selectedOfferId &&
                        selectedClient?.offers?.find(
                          (o) => o.id === selectedOfferId
                        )?.about && (
                          <Box p={3} bg="gray.50" borderRadius="md">
                            <Text fontWeight="bold" mb={1}>
                              Предыдущее описание услуги:
                            </Text>
                            <Text whiteSpace="pre-wrap">
                              {
                                selectedClient.offers.find(
                                  (o) => o.id === selectedOfferId
                                ).about
                              }
                            </Text>
                          </Box>
                        )}
                    </>
                  )}
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={closeModal}>
                Отмена
              </Button>
              <Button colorScheme="blue" onClick={handleSave}>
                Сохранить
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>

      <Box pos="relative" mt={"50px"} px="50px" w="100%">
        <Footer />
      </Box>
    </Flex>
  );
}

export default Cabinet;
