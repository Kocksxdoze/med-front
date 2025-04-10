"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Button, Text } from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";

function PatientPage() {
  const pathname = usePathname(); // Get the current path
  const [patientData, setPatientData] = useState(null);

  // Extract the patient ID from the URL path
  const id = pathname?.split("/")[2]; // This assumes the URL is of the form "/patient/[id]"

  useEffect(() => {
    if (id) {
      const fetchPatientData = async () => {
        const response = await fetch(`http://localhost:4000/client/${id}`);
        const data = await response.json();
        setPatientData(data);
      };
      fetchPatientData();
    }
  }, [id]);

  const printContentRef = React.useRef(); // Create a ref for content to print

  const handlePrint = useReactToPrint({
    content: () => printContentRef.current, // Pass contentRef here
    documentTitle: `Patient_${id}_Document`,
    onBeforeGetContent: () => {
      // Check if there's content before trying to print
      if (!printContentRef.current) {
        console.error("No content to print");
        return false;
      }
      return true;
    },
  });

  if (!patientData) return <Text>Loading...</Text>;

  return (
    <Box p={5}>
      {/* Ensure the content is rendered */}
      <Box ref={printContentRef}>
        {" "}
        {/* Attach ref here */}
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
