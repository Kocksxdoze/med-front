"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Button, Text } from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";

function PatientPage() {
  const pathname = usePathname();
  const [patientData, setPatientData] = useState(null);
  const router = useRouter();

  const id = pathname?.split("/")[2];

  useEffect(() => {
    if (id) {
      const fetchPatientData = async () => {
        const response = await fetch(`http://192.168.1.13:4000/client/${id}`);
        const data = await response.json();
        setPatientData(data);
      };
      fetchPatientData();
    }
  }, [id]);

  const printContentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => printContentRef.current,
    documentTitle: `Patient_${id}_Document`,
    onBeforeGetContent: () => {
      if (!printContentRef.current) {
        console.error("No content to print");
        return false;
      }
      return true;
      router.push("/");
    },
  });

  if (!patientData) return <Text>Loading...</Text>;

  return (
    <Box
      p={5}
      w={"100%"}
      display={"flex"}
      alignContent={"center"}
      justifyContent={"center"}
    >
      <Box ref={printContentRef}>
        {" "}
        <Text fontSize="2xl">Patient Information</Text>
        <Text>Name: {patientData.name}</Text>
        <Text>Surname: {patientData.surname}</Text>
        <Text>Email: {patientData.email}</Text>
        <Text>Phone: {patientData.phoneNumber}</Text>
        <Box mt={5}>
          <Text fontSize="lg">Official Medical Document</Text>
          <Text>Patient ID: {patientData.id}</Text>
          <Text>Date of Birth: {patientData.dateBirth}</Text>
          <Text>Address: {patientData.address}</Text>
        </Box>
      </Box>
      <Button onClick={handlePrint} mt={5}>
        Распечатать документ
      </Button>
    </Box>
  );
}

export default PatientPage;
