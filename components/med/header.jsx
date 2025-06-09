import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Input,
  Heading,
  chakra,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@chakra-ui/icons";
import fetcher from "../../utils/fetcher";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

function Header() {
  const [year, setYear] = useState("");
  const [time, setTime] = useState("");
  const [weekday, setWeekday] = useState("");
  const router = useRouter();
  const [clientsCount, setClientsCount] = useState(0);
  const toast = useToast();
  const [remainingTime, setRemainingTime] = useState(3600);
  const [reports, setReports] = useState([]);

  const token = Cookies.get("token");
  const decoded = jwt.decode(token);
  const role = decoded?.role;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setYear(now.toLocaleDateString("ru-RU"));
      setTime(now.toLocaleTimeString("ru-RU"));
      const weekday = now.toLocaleDateString("ru-RU", { weekday: "long" });
      setWeekday(weekday);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch("http://localhost:4000/reports");
      const data = await response.json();
      if (response.ok) {
        setReports(data);
      }
    };
    fetchReports();
  }, []);

  const clients = async () => {
    try {
      const response = await fetch("http://localhost:4000/clients");
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setClientsCount(data.length);
        console.log("Data: ", data);
        toast({
          title: "Количество клиентов обновлено!",
          status: "success",
          duration: "5000",
          position: "bottom-right",
        });
      } else {
        toast({
          title: "Ошибка в получении клиентов.",
          status: "error",
          duration: "5000",
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    clients();
  }, []);
  useEffect(() => {
    const savedTime = localStorage.getItem("logoutTimer");
    if (savedTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      setRemainingTime(Math.max(3600 - elapsedTime, 0));
    } else {
      localStorage.setItem("logoutTimer", Date.now().toString());
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("logoutTimer");
    router.push("/auth");
  };

  // Check if user has access to a specific role
  const hasAccess = (allowedRoles) => {
    return allowedRoles.includes(role) || role === "admin";
  };

  return (
    <>
      <Flex
        zIndex="999"
        px={"25px"}
        py={"10px"}
        w={"100%"}
        bg={"#fff"}
        shadow={"2xl"}
        borderBottomRadius={"16px"}
        flexDir={"column"}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={5}
        >
          <Heading
            w="fit-content"
            lineHeight="21px"
            fontSize="25px"
            color="#0052b4"
            mt="5px"
          >
            ROSHIDON
            <Box
              fontSize="16px"
              color="black"
              w="full"
              display="flex"
              justifyContent="space-between"
              letterSpacing="widest"
            >
              <chakra.span>medical</chakra.span>
              <chakra.span>center</chakra.span>
            </Box>
          </Heading>

          <Input
            w={"35%"}
            placeholder="Пац ID или Ф.И.О."
            bg={"transparent"}
            border={0}
            outline={"none"}
            fontSize={"16px"}
            p={"10px 0"}
            borderBottom={"1px solid #000"}
            borderRadius={0}
            color={"#000"}
            _focus={{
              outline: "none",
              boxShadow: "none",
              borderBottom: "1px solid #000",
            }}
          />
          <Text>число пациентов: {clientsCount}</Text>
          <Text>
            {time} {weekday.charAt(0).toUpperCase() + weekday.slice(1)}, {year}
          </Text>
          <Button
            bg={"transparent"}
            borderBottom={"1px solid black"}
            borderRadius={"none"}
            fontWeight={"500"}
            onClick={logout}
            _hover={{ hover: "none" }}
          >
            Выход ({Math.floor(remainingTime / 60)}:
            {String(remainingTime % 60).padStart(2, "0")})
          </Button>
        </Box>

        <Box display={"flex"} alignItems={"center"} gap={"10px"} mt={5} px={5}>
          {hasAccess(["admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/")}
            >
              Главная
            </Button>
          )}

          {hasAccess(["registration", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/register")}
            >
              Регистрация
            </Button>
          )}

          {hasAccess(["registration", "doctors", "laboratory", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/patients")}
            >
              Пациенты
            </Button>
          )}

          {hasAccess(["registration", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/palates")}
            >
              Палаты
            </Button>
          )}

          {hasAccess(["accountant", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/cashbox")}
            >
              Касса
            </Button>
          )}

          {hasAccess(["doctors", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/cabinet")}
            >
              Кабинет доктора
            </Button>
          )}

          {hasAccess(["laboratory", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/diagnostic")}
            >
              Диагностика
            </Button>
          )}

          {hasAccess(["laboratory", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/lab")}
            >
              Лаборатория
            </Button>
          )}

          {hasAccess(["admin"]) && (
            <Menu>
              <MenuButton
                as={Button}
                bg={"#fff"}
                color={"#000"}
                border={"1px solid transparent"}
                borderRadius={"8px"}
                fontWeight={"600"}
                _hover={{
                  color: "#fff",
                  background: "#0052b4",
                  border: "1px solid transparent",
                }}
                rightIcon={<ChevronDownIcon />}
              >
                Настройки
              </MenuButton>
              <MenuList zIndex={"999"}>
                <MenuItem onClick={() => router.push("/settings/doctors")}>
                  Доктора
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/category")}>
                  Категории
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/sub-category")}>
                  Под-категории
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/offers")}>
                  Услуги
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/reports")}>
                  Создать категорию отчетов
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/bases")}>
                  Филлиалы
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/app-offers")}>
                  Услуги встреч
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/types")}>
                  Типы встреч
                </MenuItem>
                <MenuItem onClick={() => router.push("/settings/benefits")}>
                  Категории льгот
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {hasAccess([
            "registration",
            "accountant",
            "doctors",
            "laboratory",
            "admin",
          ]) && (
            <Menu>
              <MenuButton
                as={Button}
                bg={"#fff"}
                color={"#000"}
                border={"1px solid transparent"}
                borderRadius={"8px"}
                fontWeight={"600"}
                _hover={{
                  color: "#fff",
                  background: "#0052b4",
                  border: "1px solid transparent",
                }}
                rightIcon={<ChevronDownIcon />}
              >
                Отчеты
              </MenuButton>
              <MenuList zIndex={"999"}>
                {reports.map((report, indx) => (
                  <MenuItem
                    key={report.id}
                    onClick={() => router.push(`/report/${report.id}`)}
                  >
                    {report.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}

          {hasAccess(["registration", "doctors", "admin"]) && (
            <Button
              bg={"#fff"}
              color={"#000"}
              border={"1px solid transparent"}
              borderRadius={"8px"}
              fontWeight={"600"}
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
              onClick={() => router.push("/appointment")}
            >
              Запись на прием
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
}

export default Header;
