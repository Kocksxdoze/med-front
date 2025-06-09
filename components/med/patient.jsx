"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  chakra,
  Flex,
  Checkbox,
  CheckboxGroup,
  Stack,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

// Функция для перевода названий колонок на русский
const translateColumn = (columnName) => {
  const translations = {
    name: "Название",
    price: "Цена",
    about: "Заключение",
    analise: "Анализ",
    ready: "Готово",
    sum: "Сумма",
    doctorId: "ID врача",
    date: "Дата",
    time: "Время",
    conclusions: "Заключение",
  };
  return translations[columnName] || columnName;
};

function DataTable({ title, data }) {
  if (!data || !data.length) return <Text fontStyle="italic">Нет данных</Text>;

  const columns = Object.keys(data[0]).filter(
    (key) => key !== "id" && key !== "conclusions"
  );
  const titleFormatted =
    {
      labs: "Лабораторные анализы",
      offers: "Услуги",
      diagnostics: "Диагностика",
    }[title] || "Данные";

  return (
    <Box mb={6}>
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        {titleFormatted}
      </Text>
      <Box overflowX="auto" border="1px solid #ccc" borderRadius="md">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#eee" }}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  {translateColumn(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {col === "ready"
                      ? item[col]
                        ? "Да"
                        : "Нет"
                      : String(item[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}

export default function PatientPage() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [formState, setFormState] = useState({});
  const [editType, setEditType] = useState(null);
  const [paymentType, setPaymentType] = useState("payment");
  const [selectedItems, setSelectedItems] = useState({
    info: true,
    labs: [],
    diagnostics: [],
    offers: [],
  });
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const componentRef = useRef();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const fetchPatientData = async () => {
    const res = await fetch(`http://localhost:4000/client/${id}`);
    const data = await res.json();
    setPatientData(data);

    // Инициализируем выбранные элементы после загрузки данных
    if (data) {
      const initialSelected = {
        info: true,
        labs: data.labs ? data.labs.map((_, i) => i.toString()) : [],
        diagnostics: data.diagnostics
          ? data.diagnostics.map((_, i) => i.toString())
          : [],
        offers: data.offers ? data.offers.map((_, i) => i.toString()) : [],
      };
      setSelectedItems(initialSelected);
    }
  };

  useEffect(() => {
    if (id) fetchPatientData();
  }, [id]);

  function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const openEdit = (type) => {
    setEditType(type);
    if (type === "info") {
      setFormState({
        name: patientData?.name || "",
        surname: patientData?.surname || "",
        patronymic: patientData?.lastName || "",
        phoneNumber: patientData?.phoneNumber || "",
        age: patientData?.age || "",
      });
    } else {
      setFormState({ paymentAmount: "" });
      setPaymentType("payment");
    }
    onModalOpen();
  };

  const handleSaveEdit = async () => {
    if (!id) return;

    let updatePayload = {};

    if (editType === "payment") {
      const amount = parseFloat(formState.paymentAmount || "0");
      if (isNaN(amount) || amount <= 0) {
        alert("Введите корректную сумму");
        return;
      }

      const currentBalance = parseFloat(patientData.balance) || 0;
      const currentDebt = parseFloat(patientData.debt) || 0;

      if (paymentType === "payment") {
        updatePayload = {
          balance: currentBalance + amount,
          debt: Math.max(0, currentDebt - amount),
        };
      } else {
        updatePayload = {
          balance: Math.max(0, currentBalance - amount),
          debt: currentDebt + amount,
        };
      }
    }

    if (editType === "info") {
      updatePayload = {
        name: formState.name,
        surname: formState.surname,
        patronymic: formState.patronymic,
        phoneNumber: formState.phoneNumber,
        age: formState.age,
      };
    }

    await fetch(`http://localhost:4000/client/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });

    await fetchPatientData();
    setEditType(null);
    onModalClose();
  };

  const handlePrintModalOpen = () => {
    setIsPrintModalOpen(true);
  };

  const handlePrintModalClose = () => {
    setIsPrintModalOpen(false);
  };

  const handlePrint = () => {
    if (!componentRef.current) {
      alert("Нет контента для печати");
      return;
    }

    const printContents = componentRef.current.innerHTML;
    const newWindow = window.open("", "_blank");

    newWindow.document.write(`
      <html>
        <head>
          <title>ROSHIDON medical center</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 20px;
              background: #fff;
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1.5rem;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #eee;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .header-title {
              font-size: 24px;
              font-weight: bold;
            }
            #logo {
              width: 150px;
              height: 120px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .print-section {
              margin-bottom: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img id="logo" src="/roshidonbg.png" alt="ROSHIDON Logo" />
          </div>
          ${printContents}
        </body>
      </html>
    `);

    newWindow.document.close();
    setTimeout(() => {
      newWindow.focus();
      newWindow.print();
      newWindow.close();
    }, 50);
    setIsPrintModalOpen(false);
  };

  const generatePrintableContent = () => {
    const content = [];

    if (selectedItems.info) {
      content.push(`
        <div class="info-section">
          <h1 style="text-align:center;">ROSHIDON <br/><span style="font-size: 0.75em;">medical center</span></h1>
          <p>Ф.И.О: ${patientData.surname || ""} ${patientData.name || ""} ${
        patientData.lastName || ""
      }</p>
          <p>Дата: ${new Date().toLocaleString("ru-RU")}</p>
          <p>Возраст: ${calculateAge(patientData.dateBirth) || ""}</p>
          <p>Телефон: ${patientData.phoneNumber || ""}</p>
          <p>Баланс: ${patientData.balance || 0} UZS</p>
          <p>Долг: ${patientData.debt || 0} UZS</p>
          <p>Регистратор: ${patientData.registrator || 0}</p>
          <hr/>
        </div>
      `);
    }

    if (
      selectedItems.labs.length > 0 &&
      patientData.labs &&
      patientData.labs.length
    ) {
      content.push('<div class="print-section">');
      content.push("<h2>Лабораторные исследования</h2>");

      const keys = Object.keys(patientData.labs[0]).filter((k) => k !== "id");
      const header = keys.map((k) => `<th>${translateColumn(k)}</th>`).join("");

      selectedItems.labs.forEach((index) => {
        const lab = patientData.labs[parseInt(index)];
        if (lab) {
          const cells = keys
            .map((k) => {
              const value =
                k === "ready" ? (lab[k] ? "Да" : "Нет") : lab[k] ?? "";
              return `<td>${value}</td>`;
            })
            .join("");

          content.push(`
            <table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:15px;">
              <thead><tr>${header}</tr></thead>
              <tbody><tr>${cells}</tr></tbody>
            </table>
          `);
        }
      });

      content.push("</div>");
    }

    if (
      selectedItems.diagnostics.length > 0 &&
      patientData.diagnostics &&
      patientData.diagnostics.length
    ) {
      content.push('<div class="print-section">');
      content.push("<h2>Диагностика</h2>");

      const keys = Object.keys(patientData.diagnostics[0]).filter(
        (k) => k !== "id"
      );
      const header = keys.map((k) => `<th>${translateColumn(k)}</th>`).join("");

      selectedItems.diagnostics.forEach((index) => {
        const diag = patientData.diagnostics[parseInt(index)];
        if (diag) {
          const cells = keys
            .map((k) => {
              const value =
                k === "ready" ? (diag[k] ? "Да" : "Нет") : diag[k] ?? "";
              return `<td>${value}</td>`;
            })
            .join("");

          content.push(`
            <table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:15px;">
              <thead><tr>${header}</tr></thead>
              <tbody><tr>${cells}</tr></tbody>
            </table>
          `);
        }
      });

      content.push("</div>");
    }

    if (
      selectedItems.offers.length > 0 &&
      patientData.offers &&
      patientData.offers.length
    ) {
      content.push('<div class="print-section">');
      content.push("<h2>Услуги</h2>");

      const keys = Object.keys(patientData.offers[0]).filter((k) => k !== "id");
      const header = keys.map((k) => `<th>${translateColumn(k)}</th>`).join("");

      selectedItems.offers.forEach((index) => {
        const offer = patientData.offers[parseInt(index)];
        if (offer) {
          const cells = keys.map((k) => `<td>${offer[k] ?? ""}</td>`).join("");

          content.push(`
            <table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:15px;">
              <thead><tr>${header}</tr></thead>
              <tbody><tr>${cells}</tr></tbody>
            </table>
          `);
        }
      });

      content.push("</div>");
    }

    return content.join("");
  };

  const toggleAllItems = (category) => {
    if (!patientData || !patientData[category]) return;

    if (selectedItems[category].length === patientData[category].length) {
      // Все выбраны - снимаем все
      setSelectedItems((prev) => ({
        ...prev,
        [category]: [],
      }));
    } else {
      // Выбираем все
      setSelectedItems((prev) => ({
        ...prev,
        [category]: patientData[category].map((_, i) => i.toString()),
      }));
    }
  };

  const toggleItem = (category, index) => {
    const indexStr = index.toString();
    setSelectedItems((prev) => {
      const currentItems = [...prev[category]];
      const itemIndex = currentItems.indexOf(indexStr);

      if (itemIndex === -1) {
        currentItems.push(indexStr);
      } else {
        currentItems.splice(itemIndex, 1);
      }

      return {
        ...prev,
        [category]: currentItems,
      };
    });
  };

  if (!patientData) return <Text>Загрузка...</Text>;

  return (
    <Box borderRadius="16px" w="100%">
      <Flex alignItems="flex-start" justifyContent="flex-start" gap={5}>
        <Box
          p={8}
          bg="#fff"
          borderRadius="16px"
          mx="auto"
          boxShadow="md"
          maxW="900px"
          w="100%"
        >
          <Box mb={8} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" mb={2}>
              Карточка пациента
            </Text>
            <Divider borderColor="gray.300" />
          </Box>

          {/* Основные данные */}
          <Box
            mb={8}
            p={6}
            border="1px solid #e2e8f0"
            borderRadius="md"
            bg="gray.50"
          >
            <Text fontSize="xl" fontWeight="semibold" mb={4}>
              Основная информация
              <br />
              <chakra.span fontSize="12px">
                id пациента: {patientData.id}
              </chakra.span>
            </Text>

            <SimpleGrid columns={2} spacing={6}>
              <Box>
                <Text fontWeight="bold" color="gray.600" mb={1}>
                  Ф.И.О:
                </Text>
                <Text fontSize="lg">
                  {patientData.surname || ""} {patientData.name || ""}{" "}
                  {patientData.lastName || ""}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.600" mb={1}>
                  Телефон:
                </Text>
                <Text fontSize="lg">{patientData.phoneNumber || "-"}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.600" mb={1}>
                  Возраст:
                </Text>
                <Text fontSize="lg">
                  {calculateAge(patientData.dateBirth) || "-"}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.600" mb={1}>
                  Пол:
                </Text>
                <Text fontSize="lg">
                  {patientData.sex === 1 ? "Мужской" : "Женский"}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.600" mb={1}>
                  Баланс:
                </Text>
                <Text fontSize="lg" color="green.600" fontWeight="bold">
                  {patientData.balance || 0} UZS
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.600" mb={1}>
                  Долг:
                </Text>
                <Text fontSize="lg" color="red.600" fontWeight="bold">
                  {patientData.debt || 0} UZS
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Таблицы с дополнительными данными */}
          <Box mb={6}>
            <SimpleGrid columns={2} spacing={4}>
              {Object.entries(patientData).map(([key, value]) => {
                if (
                  ["labs", "offers", "diagnostics"].includes(key) &&
                  Array.isArray(value)
                ) {
                  return (
                    <Box key={key} gridColumn="span 2">
                      <DataTable title={key} data={value} />
                    </Box>
                  );
                }

                if (
                  [
                    "name",
                    "surname",
                    "phoneNumber",
                    "age",
                    "balance",
                    "debt",
                    "lastName",
                    "sex",
                    "id",
                  ].includes(key)
                ) {
                  return null;
                }

                return null;
              })}
            </SimpleGrid>
          </Box>

          {/* Кнопки управления */}
          <Box display="flex" gap={4} mt={6} justifyContent="center">
            <Button colorScheme="blue" onClick={() => openEdit("payment")}>
              Оплата/Списание
            </Button>
            <Button colorScheme="yellow" onClick={() => openEdit("info")}>
              Изменить личные данные
            </Button>
            <Button colorScheme="green" onClick={handlePrintModalOpen}>
              Распечатать документ
            </Button>
          </Box>
        </Box>
      </Flex>

      {/* Модальное окно для редактирования */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editType === "payment"
              ? paymentType === "payment"
                ? "Внести оплату"
                : "Списать средства"
              : "Редактировать личные данные"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editType === "payment" && (
              <>
                <Flex mb={4} gap={2}>
                  <Button
                    flex={1}
                    colorScheme={paymentType === "payment" ? "blue" : "gray"}
                    onClick={() => setPaymentType("payment")}
                  >
                    Внести оплату
                  </Button>
                  <Button
                    flex={1}
                    colorScheme={paymentType === "deduction" ? "blue" : "gray"}
                    onClick={() => setPaymentType("deduction")}
                  >
                    Списать средства
                  </Button>
                </Flex>
                <FormControl>
                  <FormLabel>
                    {paymentType === "payment"
                      ? "Сумма оплаты (UZS)"
                      : "Сумма списания (UZS)"}
                  </FormLabel>
                  <Input
                    type="number"
                    value={formState.paymentAmount || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        paymentAmount: e.target.value,
                      })
                    }
                    placeholder="Введите сумму"
                  />
                </FormControl>
              </>
            )}

            {editType === "info" && (
              <>
                <FormControl mb={3}>
                  <FormLabel>Фамилия</FormLabel>
                  <Input
                    value={formState.surname || ""}
                    onChange={(e) =>
                      setFormState({ ...formState, surname: e.target.value })
                    }
                    placeholder="Фамилия"
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Имя</FormLabel>
                  <Input
                    value={formState.name || ""}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="Имя"
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Отчество</FormLabel>
                  <Input
                    value={formState.patronymic || ""}
                    onChange={(e) =>
                      setFormState({ ...formState, patronymic: e.target.value })
                    }
                    placeholder="Отчество"
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Телефон</FormLabel>
                  <Input
                    value={formState.phoneNumber || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="Телефон"
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onModalClose}>
              Отмена
            </Button>
            <Button colorScheme="blue" onClick={handleSaveEdit}>
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальное окно для выбора таблиц для печати */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={handlePrintModalClose}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>Выберите данные для печати</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={6}>
              <Box>
                <Checkbox
                  isChecked={selectedItems.info}
                  onChange={(e) =>
                    setSelectedItems((prev) => ({
                      ...prev,
                      info: e.target.checked,
                    }))
                  }
                >
                  Основная информация
                </Checkbox>
              </Box>

              {patientData?.labs?.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    Лабораторные анализы
                  </Heading>
                  <Checkbox
                    isChecked={
                      selectedItems.labs.length === patientData.labs.length
                    }
                    isIndeterminate={
                      selectedItems.labs.length > 0 &&
                      selectedItems.labs.length < patientData.labs.length
                    }
                    onChange={() => toggleAllItems("labs")}
                    mb={2}
                  >
                    Выбрать все
                  </Checkbox>
                  <Stack pl={6} spacing={1}>
                    {patientData.labs.map((item, index) => (
                      <Checkbox
                        key={index}
                        isChecked={selectedItems.labs.includes(
                          index.toString()
                        )}
                        onChange={() => toggleItem("labs", index)}
                      >
                        {item.name || `Анализ ${index + 1}`}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              )}

              {patientData?.diagnostics?.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    Диагностика
                  </Heading>
                  <Checkbox
                    isChecked={
                      selectedItems.diagnostics.length ===
                      patientData.diagnostics.length
                    }
                    isIndeterminate={
                      selectedItems.diagnostics.length > 0 &&
                      selectedItems.diagnostics.length <
                        patientData.diagnostics.length
                    }
                    onChange={() => toggleAllItems("diagnostics")}
                    mb={2}
                  >
                    Выбрать все
                  </Checkbox>
                  <Stack pl={6} spacing={1}>
                    {patientData.diagnostics.map((item, index) => (
                      <Checkbox
                        key={index}
                        isChecked={selectedItems.diagnostics.includes(
                          index.toString()
                        )}
                        onChange={() => toggleItem("diagnostics", index)}
                      >
                        {item.name || `Диагностика ${index + 1}`}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              )}

              {patientData?.offers?.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    Услуги
                  </Heading>
                  <Checkbox
                    isChecked={
                      selectedItems.offers.length === patientData.offers.length
                    }
                    isIndeterminate={
                      selectedItems.offers.length > 0 &&
                      selectedItems.offers.length < patientData.offers.length
                    }
                    onChange={() => toggleAllItems("offers")}
                    mb={2}
                  >
                    Выбрать все
                  </Checkbox>
                  <Stack pl={6} spacing={1}>
                    {patientData.offers.map((item, index) => (
                      <Checkbox
                        key={index}
                        isChecked={selectedItems.offers.includes(
                          index.toString()
                        )}
                        onChange={() => toggleItem("offers", index)}
                      >
                        {item.name || `Услуга ${index + 1}`}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handlePrintModalClose}>
              Отмена
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                componentRef.current.innerHTML = generatePrintableContent();
                handlePrint();
              }}
            >
              Печать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        ref={componentRef}
        display="none"
        dangerouslySetInnerHTML={{
          __html: generatePrintableContent(),
        }}
      />
    </Box>
  );
}
