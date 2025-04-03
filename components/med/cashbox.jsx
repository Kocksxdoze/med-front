import React, { useState, useEffect } from "react";
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

function CashboxTable() {
  const [cashboxData, setCashboxData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCashbox() {
      try {
        const response = await fetch("http://localhost:4000/cashbox");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCashboxData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching cashbox data:", error);
      }
    }
    loadCashbox();
  }, []);

  const filteredCashbox = cashboxData.filter((item) =>
    [
      item?.id,
      item?.clientId,
      item?.doctorId,
      item?.payment,
      item?.status,
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
              <Th minWidth="auto">ID Клиента</Th>
              <Th minWidth="auto">ID Доктора</Th>
              <Th minWidth="auto">Сумма</Th>
              <Th minWidth="auto">Скидка</Th>
              <Th minWidth="auto">Дата</Th>
              <Th minWidth="auto">Способ оплаты</Th>
              <Th minWidth="auto">Долг</Th>
              <Th minWidth="auto">Статус</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCashbox.map((item) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.clientId}</Td>
                <Td>{item.doctorId}</Td>
                <Td>{item.sum}</Td>
                <Td>{item.discount}</Td>
                <Td>{new Date(item.date).toLocaleDateString()}</Td>
                <Td>{item.payment}</Td>
                <Td>{item.debt !== null ? item.debt : "0"}</Td>
                <Td>{item.status === 1 ? "Оплачено" : "Не оплачено"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CashboxTable;
