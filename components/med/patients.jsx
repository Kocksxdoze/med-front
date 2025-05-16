"use client";
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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadPatients() {
      const data = await fetchClients();
      setPatients(Array.isArray(data) ? data : []);
    }
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    [
      patient?.id,
      patient?.name,
      patient?.surname,
      patient?.lastname,
      patient?.createdAt,
    ].some((field) =>
      field?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box p={4} borderRadius={"16px"} w="100%" overflowX="auto" bg="#fff">
      <InputGroup mb={4} w={{ base: "100%", md: "50%" }}>
        <Input
          placeholder="Поиск по любому параметру"
          color={"black"}
          _placeholder={{
            color: "black",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          border="1px solid #000"
          pr="2.5rem"
        />
        <InputRightElement>
          <SearchIcon color="black.500" />
        </InputRightElement>
      </InputGroup>

      <TableContainer overflowX="auto" width="100%">
        <Table
          variant="striped"
          size="sm"
          width="100%"
          style={{ tableLayout: "auto" }}
        >
          <Thead position="sticky" top={0} zIndex={1} bg="white">
            <Tr>
              <Th minWidth="auto">ID</Th>
              <Th minWidth="auto">ФИО</Th>
              <Th minWidth="auto">Телефон</Th>
              <Th minWidth="auto">Домашний Телефон</Th>
              <Th minWidth="auto">Пол</Th>
              <Th minWidth="auto">Дата рождения</Th>
              <Th minWidth="auto">Соц положение</Th>
              <Th minWidth="auto">Долг</Th>
              <Th minWidth="auto">Скидка</Th>
              <Th minWidth="auto">Категория льготы</Th>
              <Th minWidth="auto">Навигация</Th>
              <Th minWidth="auto">Доктор</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.map((patient) => (
              <Tr
                key={patient.id}
                onClick={() => router.push(`/patient/${patient.id}`)}
                _hover={{ backgroundColor: "#fff" }}
                cursor={"pointer"}
              >
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
