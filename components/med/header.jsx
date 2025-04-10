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

function Header() {
  const [year, setYear] = useState("");
  const [time, setTime] = useState("");
  const [weekday, setWeekday] = useState("");
  const router = useRouter();
  const [clientsCount, setClientsCount] = useState(0);
  const toast = useToast();
  const [remainingTime, setRemainingTime] = useState(3600);
  const [reports, setReports] = useState([]);

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
      } else {
        return null;
      }
    };
    // fetchReports();
  });

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
            h={"auto"}
            w={"auto"}
            lineHeight={"21px"}
            fontSize={"25px"}
            color={"#0052b4"}
            mt={"5px"}
          >
            ROSHIDON
            <br />
            <chakra.span
              fontSize={"16px"}
              w={"auto"}
              h={"auto"}
              color={"black"}
            >
              medical center
            </chakra.span>
          </Heading>

          <Input
            w={"150px"}
            placeholder="№ карты"
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
          <Input
            w={"150px"}
            placeholder="Лаб ID"
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
          <Input
            w={"150px"}
            placeholder="Пац ID"
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
              <MenuItem onClick={() => router.push("/settings/bases")}>
                Филлиалы
              </MenuItem>
              <MenuItem onClick={() => router.push("/settings/doctors")}>
                Доктора
              </MenuItem>
              <MenuItem onClick={() => router.push("/settings/category")}>
                Категории
              </MenuItem>
              <MenuItem onClick={() => router.push("/settings/sub-category")}>
                Под-категории
              </MenuItem>
              <MenuItem onClick={() => router.push("/settings/reports")}>
                Создать категорию отчетов
              </MenuItem>
            </MenuList>
          </Menu>
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
              {reports.map((report) => (
                <>
                  <MenuItem
                    onClick={() => router.push(`/reports/${report.name}`)}
                  >
                    {report.name}
                  </MenuItem>
                </>
              ))}
            </MenuList>
          </Menu>
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
            onClick={() => router.push("/register/cleint")}
          >
            Запись на прием
          </Button>
        </Box>
      </Flex>
    </>
  );
}

export default Header;
