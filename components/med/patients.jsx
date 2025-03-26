import React, { useState, useEffect } from "react";
import fetchClients from "../../utils/fetchClients";
import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPatients() {
      const data = await fetchClients();
      setPatients(Array.isArray(data) ? data : []);
    }
    loadPatients();
  }, []);

  const filteredPatients = Array.isArray(patients)
    ? patients.filter((patient) =>
        [patient?.id, patient?.name, patient?.createdAt].some((field) =>
          field?.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
    : [];

  return (
    <Box p={4} maxW="100vw" overflowX="auto" bg={"#fff"}>
      <Input
        placeholder="Поиск по любому параметру"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={4}
        w={{ base: "100%", md: "50%" }}
      />
      <TableContainer overflowX="auto" maxH="80vh">
        <Table
          variant="simple"
          size="sm"
          minW="1200px"
          style={{ tableLayout: "auto" }}
        >
          <Thead position="sticky" top={0} zIndex={1} bg="white">
            <Tr>
              <Th>ID</Th>
              <Th whiteSpace="nowrap">ФИО</Th>
              <Th whiteSpace="nowrap">Телефон</Th>
              <Th whiteSpace="nowrap">Домашний Телефон</Th>
              <Th>Пол</Th>
              <Th whiteSpace="nowrap">Дата рождения</Th>
              <Th>Оплата</Th>
              <Th>Республика</Th>
              <Th>Регион</Th>
              <Th>Адрес</Th>
              <Th whiteSpace="nowrap">Паспорт</Th>
              <Th whiteSpace="nowrap">ПИНФЛ</Th>
              <Th whiteSpace="nowrap">Социальное положение</Th>
              <Th>Работа</Th>
              <Th>Долг</Th>
              <Th>Баланс</Th>
              <Th>Скидка</Th>
              <Th whiteSpace="nowrap">Категория льготы</Th>
              <Th>Навигация</Th>
              <Th>Доктор</Th>
              <Th>База</Th>
              <Th>Роль</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.map((patient) => (
              <Tr key={patient.id}>
                <Td>{patient.id}</Td>
                <Td>{`${patient.surname} ${patient.name} ${patient.lastName}`}</Td>
                <Td>{patient.phoneNumber}</Td>
                <Td>{patient.homePhone}</Td>
                <Td>{patient.sex}</Td>
                <Td>{patient.dateBirth}</Td>
                <Td>{patient.payment}</Td>
                <Td>{patient.republic}</Td>
                <Td>{patient.region}</Td>
                <Td>{patient.addres}</Td>
                <Td>{`${patient.passportSeries} ${patient.passportNum}`}</Td>
                <Td>{patient.pinfl}</Td>
                <Td>{patient.socialPlace}</Td>
                <Td>{patient.work}</Td>
                <Td>{patient.debt}</Td>
                <Td>{patient.balance}</Td>
                <Td>{patient.discount}</Td>
                <Td>{patient.benefitCategory}</Td>
                <Td>{patient.navigation}</Td>
                <Td>{patient.doctor}</Td>
                <Td>{patient.base}</Td>
                <Td>{patient.role}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Patients;
