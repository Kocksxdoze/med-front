"use client";
import React, { useState, useRef, useEffect } from "react";
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
  Select,
  useToast,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import Header from "../../components/med/header";
import Footer from "../../components/med/footer";
import ParticlesComponent from "../../components/med/particles";
import { useRouter } from "next/navigation";
import fetcher from "../../utils/fetcher";
import Cookies from "js-cookie";
import Reg from "../../components/reg/reg";
import { getApiBaseUrl } from "../../utils/api";

function Register() {
  const formRef = useRef({});
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [labCategories, setLabCategories] = useState([]);
  const [diaCategories, setDiaCategories] = useState([]);
  const [offerCategories, setOfferCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const api = getApiBaseUrl();

  // Модальные окна для разных типов услуг
  const {
    isOpen: isLabOpen,
    onOpen: onLabOpen,
    onClose: onLabClose,
  } = useDisclosure();
  const {
    isOpen: isDiaOpen,
    onOpen: onDiaOpen,
    onClose: onDiaClose,
  } = useDisclosure();
  const {
    isOpen: isOfferOpen,
    onOpen: onOfferOpen,
    onClose: onOfferClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [promos, bens, labs, dias, offers] = await Promise.all([
          fetcher("promocodes"),
          fetcher("benefits"),
          fetcher("lab-categories"),
          fetcher("dia-categories"),
          fetcher("offer-categories"),
        ]);
        setPromoCodes(promos);
        setBenefits(bens);
        setLabCategories(labs);
        setDiaCategories(dias);
        setOfferCategories(offers);
      } catch (err) {
        console.error("Error loading initial data:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [toast]);

  const change = (e) => {
    formRef.current[e.target.name] = e.target.value;
  };

  const handlePromoChange = (e) => {
    const promo = promoCodes.find((p) => p.id === e.target.value);
    setSelectedPromo(promo);
    formRef.current.promoCodeId = e.target.value;
  };

  const handleBenefitChange = (e) => {
    const benefit = benefits.find((b) => b.id === e.target.value);
    setSelectedBenefit(benefit);
    formRef.current.benefitId = e.target.value;
  };

  const handleServiceSelect = (service, type) => {
    setSelectedServices((prev) => {
      // Удаляем предыдущий сервис такого же типа, если он есть
      const filtered = prev.filter((s) => s.type !== type);
      return [...filtered, { ...service, type }];
    });

    // Обновляем общую сумму долга
    formRef.current.debt = service.sum || 0;

    // Если это услуга с доктором, получаем информацию о докторе
    if (type === "offer" && service.doctorId) {
      fetcher(`doctor/${service.doctorId}`)
        .then((doctor) => {
          formRef.current.doctor =
            `${doctor.surname} ${doctor.name}` || "Не указан";
          formRef.current.doctorId = service.doctorId;
        })
        .catch((err) => console.error("Error fetching doctor:", err));
    }

    // Закрываем модальное окно после выбора
    if (type === "lab") onLabClose();
    if (type === "dia") onDiaClose();
    if (type === "offer") onOfferClose();
  };

  const removeService = (serviceId) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    formRef.current.debt = 0;
  };

  const calculateTotal = () => {
    return selectedServices.reduce(
      (sum, service) => sum + (service.sum || 0),
      0
    );
  };

  const submit = async () => {
    const token = Cookies.get("token");
    let registrator = "Unknown";
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        registrator = `${payload.surname} ${payload.name}`;
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }

    const formData = {
      ...formRef.current,
      sex: value2,
      registrator,
      debt: calculateTotal(),
    };

    try {
      setLoading(true);
      const response = await fetch(`${api}/client/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Ошибка создания клиента");

      setClientId(data.id);
      toast({
        title: "Успешно",
        description: "Пациент успешно зарегистрирован",
        status: "success",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось зарегистрировать пациента",
        status: "error",
      });
    } finally {
      setLoading(false);
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

            {/* Форма регистрации пациента */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              px={"100px"}
              gap={10}
            >
              {/* Левая колонка формы */}
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
                  <RadioGroup onChange={setValue2} value={value2}>
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

              {/* Правая колонка формы */}
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
                    name="passportIssueDate"
                    onChange={change}
                    placeholder="Дата выдачи"
                  />
                  <Input
                    _hover={{ border: "1px solid #0052b4" }}
                    border={"1px solid #000"}
                    w={"100%"}
                    name="passportExpiryDate"
                    onChange={change}
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

            {/* Блок промокодов, льгот и направлений */}
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
                <Box w="100%">
                  <Select
                    placeholder="Выберите промокод"
                    onChange={handlePromoChange}
                  >
                    {promoCodes.map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.code} ({promo.presentage}% скидка)
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box w="100%">
                  <Select
                    placeholder="Выберите льготу"
                    onChange={handleBenefitChange}
                  >
                    {benefits.map((benefit) => (
                      <option key={benefit.id} value={benefit.id}>
                        {benefit.name}
                      </option>
                    ))}
                  </Select>
                </Box>
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
                  value={formRef.doctor || ""}
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="doctorId"
                  onChange={change}
                  placeholder="ID Врача"
                  value={formRef.doctorId || ""}
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

                  {value === "insurance" && (
                    <Stack mt={3} spacing={2}>
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        name="insuranceCompany"
                        onChange={change}
                        placeholder="Компания"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        name="policyNumber"
                        onChange={change}
                        placeholder="Номер полиса"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        name="policyBalance"
                        onChange={change}
                        placeholder="Баланс полиса"
                      />
                    </Stack>
                  )}

                  {value === "history" && (
                    <Stack mt={3} spacing={2}>
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        name="cardType"
                        onChange={change}
                        placeholder="Тип карты"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        name="historyNumber"
                        onChange={change}
                        placeholder="№ Истории болезни"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        name="openDate"
                        onChange={change}
                        placeholder="Дата открытия"
                      />
                      <Input
                        _hover={{ border: "1px solid #0052b4" }}
                        border={"1px solid #000"}
                        name="responsibleDoctor"
                        onChange={change}
                        placeholder="Ответственный врач"
                      />
                    </Stack>
                  )}
                </chakra.div>
              </chakra.span>
            </Flex>

            {/* Блок выбора услуг - компактный вариант с модальными окнами */}
            <Flex
              px={"100px"}
              gap={5}
              w={"100%"}
              alignItems={"flex-start"}
              mt={8}
              flexWrap="wrap"
            >
              <Button colorScheme="blue" variant="outline" onClick={onLabOpen}>
                + Лабораторные анализы
              </Button>

              <Button colorScheme="blue" variant="outline" onClick={onDiaOpen}>
                + Диагностические исследования
              </Button>

              <Button
                colorScheme="blue"
                variant="outline"
                onClick={onOfferOpen}
              >
                + Медицинские услуги
              </Button>

              {/* Отображение выбранных услуг */}
              {selectedServices.length > 0 && (
                <Box mt={4} w="100%">
                  <Text fontWeight="bold" mb={2}>
                    Выбранные услуги:
                  </Text>
                  <SimpleGrid columns={3} spacing={2}>
                    {selectedServices.map((service) => (
                      <Tag
                        key={service.id}
                        size="lg"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="blue"
                      >
                        <TagLabel>
                          {service.name} - {service.sum} сум
                        </TagLabel>
                        <TagCloseButton
                          onClick={() => removeService(service.id)}
                        />
                      </Tag>
                    ))}
                  </SimpleGrid>
                  <Text mt={2} fontWeight="bold">
                    Общая сумма: {calculateTotal()} сум
                  </Text>
                </Box>
              )}
            </Flex>

            {/* Модальное окно для лабораторных анализов */}
            <Modal isOpen={isLabOpen} onClose={onLabClose} size="xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Выберите лабораторный анализ</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    {labCategories.map((category) => (
                      <Box key={category.id} w="100%">
                        <Button
                          w="100%"
                          onClick={() => handleServiceSelect(category, "lab")}
                          colorScheme="blue"
                          variant="outline"
                          justifyContent="space-between"
                        >
                          <Text>{category.name}</Text>
                          <Text fontWeight="bold">{category.sum} сум</Text>
                        </Button>
                      </Box>
                    ))}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={onLabClose}>
                    Закрыть
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Модальное окно для диагностических исследований */}
            <Modal isOpen={isDiaOpen} onClose={onDiaClose} size="xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Выберите диагностическое исследование</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    {diaCategories.map((category) => (
                      <Box key={category.id} w="100%">
                        <Button
                          w="100%"
                          onClick={() => handleServiceSelect(category, "dia")}
                          colorScheme="blue"
                          variant="outline"
                          justifyContent="space-between"
                        >
                          <Text>{category.name}</Text>
                          <Text fontWeight="bold">{category.sum} сум</Text>
                        </Button>
                      </Box>
                    ))}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={onDiaClose}>
                    Закрыть
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Модальное окно для медицинских услуг */}
            <Modal isOpen={isOfferOpen} onClose={onOfferClose} size="xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Выберите медицинскую услугу</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    {offerCategories.map((category) => (
                      <Box key={category.id} w="100%">
                        <Text fontWeight="bold" mb={2}>
                          {category.categoryName}
                        </Text>
                        <VStack pl={4} spacing={2}>
                          {category.subcategories?.map((sub) => (
                            <Box key={sub.id} w="100%">
                              <Text fontWeight="semibold" mb={1}>
                                {sub.name}
                              </Text>
                              <VStack pl={4} spacing={1}>
                                {sub.offers?.map((offer) => (
                                  <Button
                                    key={offer.id}
                                    w="100%"
                                    onClick={() =>
                                      handleServiceSelect(offer, "offer")
                                    }
                                    variant="ghost"
                                    justifyContent="space-between"
                                  >
                                    <Text textAlign="left">{offer.name}</Text>
                                    <Text fontWeight="bold">
                                      {offer.sum} сум
                                    </Text>
                                  </Button>
                                ))}
                              </VStack>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={onOfferClose}>
                    Закрыть
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Кнопки отправки формы */}
            <Flex
              alignItems={"center"}
              gap={3}
              mt={"50px"}
              px={"100px"}
              justifyContent={"flex-end"}
            >
              <Button
                border={"1px solid transparent"}
                onClick={() => router.push("/patients")}
              >
                Вернуться к списку
              </Button>
              <Button
                bg={"#0253b4"}
                color={"white"}
                onClick={submit}
                isLoading={loading}
                _hover={{
                  bg: "transparent",
                  color: "#000",
                  border: "1px solid #0253b4",
                }}
              >
                Добавить
              </Button>
            </Flex>

            {/* Компонент для отправки данных анализов/услуг после создания клиента */}
            {clientId !== null && selectedServices.length > 0 && (
              <Reg
                clientId={clientId}
                services={selectedServices}
                onSuccess={() => router.push(`/patient/${clientId}`)}
              />
            )}
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
