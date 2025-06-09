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
  Collapse,
} from "@chakra-ui/react";
import Header from "../../components/med/header";
import Footer from "../../components/med/footer";
import ParticlesComponent from "../../components/med/particles";
import { useRouter } from "next/navigation";
import fetcher from "../../utils/fetcher";
import Cookies from "js-cookie";
import Reg from "../../components/reg/reg";

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
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedDia, setSelectedDia] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

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

  const toggleCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
    setExpandedSubcategory(null);
  };

  const toggleSubcategory = (id) => {
    setExpandedSubcategory(expandedSubcategory === id ? null : id);
  };

  const handleLabSelect = (category) => {
    setSelectedLab(category);
    setSelectedDia(null);
    setSelectedOffer(null);
    formRef.current.debt = category.sum || 0;
  };

  const handleDiaSelect = (category) => {
    setSelectedDia(category);
    setSelectedLab(null);
    setSelectedOffer(null);
    formRef.current.debt = category.sum || 0;
  };

  const handleOfferSelect = async (offer) => {
    setSelectedOffer(offer);
    setSelectedLab(null);
    setSelectedDia(null);
    formRef.current.debt = offer.sum || 0;
    formRef.current.doctorId = offer.doctorId;

    if (offer.doctorId) {
      try {
        const doctor = await fetcher(`doctor/${offer.doctorId}`);
        formRef.current.doctor =
          `${doctor.surname} ${doctor.name}` || "Не указан";
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    }
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
    console.log("clientId:", clientId);
    const formData = {
      ...formRef.current,
      sex: value2,
      registrator,
      debt: selectedOffer?.sum || selectedLab?.sum || selectedDia?.sum || 0,
    };

    try {
      setLoading(true);
      const response = await fetch("http://0.0.0.0:4000/client/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("xxxx", data);
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
                  value={formRef.current.doctor || ""}
                  readOnly
                />
                <Input
                  _hover={{ border: "1px solid #0052b4" }}
                  border={"1px solid #000"}
                  w={"100%"}
                  name="doctorId"
                  onChange={change}
                  placeholder="ID Врача"
                  value={formRef.current.doctorId || ""}
                  readOnly
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

            {/* Блок выбора услуг/лаборатории/диагностики */}
            <Flex
              px={"100px"}
              gap={10}
              w={"100%"}
              alignItems={"flex-start"}
              mt={8}
            >
              <VStack spacing={4} w="100%" align="stretch">
                <Box>
                  <Heading size="md" mb={4}>
                    Лабораторные анализы
                  </Heading>
                  <VStack spacing={2} align="stretch">
                    {labCategories.map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => handleLabSelect(category)}
                        colorScheme={
                          selectedLab?.id === category.id ? "blue" : "gray"
                        }
                        variant={
                          selectedLab?.id === category.id ? "solid" : "outline"
                        }
                        justifyContent="flex-start"
                      >
                        <HStack justify="space-between" w="100%">
                          <Text>{category.name}</Text>
                          <Text fontWeight="bold">{category.sum} сум</Text>
                        </HStack>
                      </Button>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" mb={4}>
                    Диагностические исследования
                  </Heading>
                  <VStack spacing={2} align="stretch">
                    {diaCategories.map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => handleDiaSelect(category)}
                        colorScheme={
                          selectedDia?.id === category.id ? "blue" : "gray"
                        }
                        variant={
                          selectedDia?.id === category.id ? "solid" : "outline"
                        }
                        justifyContent="flex-start"
                      >
                        <HStack justify="space-between" w="100%">
                          <Text>{category.name}</Text>
                          <Text fontWeight="bold">{category.sum} сум</Text>
                        </HStack>
                      </Button>
                    ))}
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" mb={4}>
                    Медицинские услуги
                  </Heading>
                  <VStack spacing={4}>
                    {offerCategories.map((category) => (
                      <Box key={category.id} w="100%">
                        <Button
                          w="100%"
                          onClick={() => toggleCategory(category.id)}
                          color="#000"
                          border="1px solid #000"
                          fontWeight="400"
                          fontSize="20px"
                          variant="ghost"
                          _hover={{
                            color: "#fff",
                            background: "#0052b4",
                            border: "1px solid transparent",
                          }}
                        >
                          {category.categoryName}
                        </Button>

                        <Collapse
                          in={expandedCategory === category.id}
                          animateOpacity
                        >
                          <VStack align="start" pl={5} mt={2} spacing={3}>
                            {category.subcategories?.map((sub) => (
                              <Box key={sub.id} w="100%">
                                <Button
                                  fontSize="17px"
                                  variant="ghost"
                                  onClick={() => toggleSubcategory(sub.id)}
                                  color="#000"
                                  border="1px solid #000"
                                  fontWeight="400"
                                  _hover={{
                                    color: "#fff",
                                    background: "#0052b4",
                                    border: "1px solid transparent",
                                  }}
                                >
                                  {sub.name}
                                </Button>

                                <Collapse
                                  in={expandedSubcategory === sub.id}
                                  animateOpacity
                                >
                                  <VStack align="start" pl={5} mt={2}>
                                    {sub.offers?.map((offer) => (
                                      <HStack key={offer.id} spacing={4}>
                                        <Text fontSize="17px">
                                          {offer.name} — {offer.sum} сум
                                        </Text>
                                        <Button
                                          size="sm"
                                          colorScheme="blue"
                                          onClick={() =>
                                            handleOfferSelect(offer)
                                          }
                                        >
                                          Выбрать
                                        </Button>
                                      </HStack>
                                    ))}
                                  </VStack>
                                </Collapse>
                              </Box>
                            ))}
                          </VStack>
                        </Collapse>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </Flex>

            {/* Отображение выбранной услуги */}
            {(selectedLab || selectedDia || selectedOffer) && (
              <Box mt={4} p={4} bg="blue.50" borderRadius="md" mx="100px">
                <Text fontWeight="bold">Выбрано:</Text>
                {selectedLab && (
                  <Text>
                    Лабораторный анализ: {selectedLab.name} - {selectedLab.sum}{" "}
                    сум
                  </Text>
                )}
                {selectedDia && (
                  <Text>
                    Диагностика: {selectedDia.name} - {selectedDia.sum} сум
                  </Text>
                )}
                {selectedOffer && (
                  <>
                    <Text>
                      Услуга: {selectedOffer.name} - {selectedOffer.sum} сум
                    </Text>
                    {formRef.current.doctor && (
                      <Text>Врач: {formRef.current.doctor}</Text>
                    )}
                  </>
                )}
              </Box>
            )}

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
            {clientId !== null && (
              <Reg
                clientId={clientId}
                name={
                  selectedLab?.name ||
                  selectedDia?.name ||
                  selectedOffer?.name ||
                  ""
                }
                price={
                  selectedLab?.sum ||
                  selectedDia?.sum ||
                  selectedOffer?.sum ||
                  0
                }
                labId={selectedLab?.id}
                analise={
                  selectedLab?.about ||
                  selectedDia?.about ||
                  selectedOffer?.about ||
                  "none"
                }
                diaId={selectedDia?.id}
                offerId={selectedOffer?.id}
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
