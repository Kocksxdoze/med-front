"use client";
import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import Header from "../components/med/header";
import ParticlesComponent from "../components/med/particles";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
