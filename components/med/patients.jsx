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

  const filteredPatients = patients.filter((patient) =>
    [patient?.id, patient?.name, patient?.createdAt].some((field) =>
      field?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box p={4} borderRadius={"16px"} w="100%" overflowX="auto" bg="#fff">
      <Input
        placeholder="Поиск по любому параметру"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={4}
        border="1px solid #000"
        w={{ base: "100%", md: "50%" }}
      />
      <TableContainer overflowX="auto" maxWidth="100vw">
        <Table
          variant="striped"
          size="sm"
          width="100%"
          style={{ tableLayout: "auto" }}
        >
          <Thead position="sticky" top={0} zIndex={1} bg="white">
            <Tr>
              <Th minWidth="50px">ID</Th>
              <Th minWidth="150px">ФИО</Th>
              <Th minWidth="120px">Телефон</Th>
              <Th minWidth="120px">Домашний Телефон</Th>
              <Th minWidth="80px">Пол</Th>
              <Th minWidth="120px">Дата рождения</Th>
              <Th minWidth="120px">Соц положение</Th>
              <Th minWidth="75px">Долг</Th>
              <Th minWidth="80px">Скидка</Th>
              <Th minWidth="150px">Категория льготы</Th>
              <Th minWidth="120px">Навигация</Th>
              <Th minWidth="120px">Доктор</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.map((patient) => (
              <Tr key={patient.id}>
                <Td>{patient.id}</Td>
                <Td>{`${patient.surname} ${patient.name} ${patient.lastName}`}</Td>
                <Td>{patient.phoneNumber}</Td>
                <Td>{patient.homePhone}</Td>
                <Td>{patient.sex === 1 ? "Мужской" : "Женский"}</Td>
                <Td>{new Date(patient.dateBirth).toLocaleDateString()}</Td>
                <Td>{patient.socialPlace}</Td>
                <Td>{patient.debt}</Td>
                <Td>{patient.discount}</Td>
                <Td>{patient.benefitCategory}</Td>
                <Td>{patient.navigation}</Td>
                <Td>{patient.doctor}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Patients;
