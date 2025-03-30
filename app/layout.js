"use client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  const theme = extendTheme({
    components: {
      Radio: {
        baseStyle: {
          control: {
            _checked: {
              bg: "#000",
              borderColor: "#000",
              _hover: {
                borderColor: "#000",
                bg: "#000",
              },
            },
            _hover: {
              borderColor: "#000",
              bg: "#fff",
            },
          },
        },
      },
      Checkbox: {
        baseStyle: {
          control: {
            _checked: {
              bg: "#000",
              borderColor: "#000",
              _hover: {
                borderColor: "#000",
                bg: "#000",
              },
            },
            _hover: {
              borderColor: "#000",
              bg: "#fff",
            },
          },
        },
      },
    },
  });

  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
