import React, { useState, useEffect } from "react";
import fetcher from "../../utils/fetcher";
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

function Reports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadReports() {
      const data = await fetcher("reports");
      setReports(Array.isArray(data) ? data : []);
    }
    loadReports();
  }, []);

  const filteredReports = reports.filter((report) =>
    [report?.id, report?.name, report?.createdAt].some((field) =>
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

      <TableContainer overflowX="auto" w="100%">
        <Table
          variant="striped"
          size="sm"
          width="100%"
          style={{ tableLayout: "auto" }}
        >
          <Thead position="sticky" top={0} zIndex={1} bg="white">
            <Tr>
              <Th minWidth="auto">ID</Th>
              <Th minWidth="auto">Название</Th>
              <Th minWidth="auto">Категория отчета</Th>
              <Th minWidth="auto">Содержание отчета</Th>
              <Th minWidth="auto">ID Врача</Th>
              <Th minWidth="auto">Дата создания</Th>
              <Th minWidth="auto">Дата редактирования</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredReports.map((report) => (
              <Tr key={report.id}>
                <Td>{report.id}</Td>
                <Td>{report.name}</Td>
                <Td>{report.reportCategory}</Td>
                <Td>{report.desc}</Td>
                <Td>{report.doctorId}</Td>
                <Td>{report.toLocaleDateString().createdAt}</Td>
                <Td>{report.toLocaleDateString().updatedAt}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Reports;
