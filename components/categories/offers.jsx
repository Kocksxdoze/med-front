"use client";
import React, { useState, useEffect } from "react";
import fetcher from "../../utils/fetcher";
import {
  Flex,
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
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

function Offers() {
  const [offers, setoffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sum: "",
    subCategoryId: "",
    doctorId: "",
    createdAt: "",
  });

  // Загрузка подкатегорий
  async function loadoffers() {
    const data = await fetcher("offers");
    setoffers(Array.isArray(data) ? data : []);
  }

  // Загрузка категорий
  async function loadCategories() {
    const data = await fetcher("doctors");
    setCategories(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadoffers();
    loadCategories();
  }, []);

  const filteredoffers = offers.filter((offer) =>
    [offer?.id, offer?.name, offer?.createdAt].some((field) =>
      field?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleCreateoffer = async () => {
    if (!formData.name || formData.name.trim() === "") {
      toast({
        title: "Имя услуги обязательно.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Далее отправляем запрос
    try {
      if (isEditing) {
        // Обновление
        await axios.put(
          `http://192.168.1.13:4000/offer/edit/${editingId}`,
          formData
        );
        toast({
          title: "Услуга обновлена.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        // Создание
        await axios.post("http://192.168.1.13:4000/offer/new", formData);
        toast({
          title: "Услуга создана.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      }
      loadoffers();
      onClose();
      setFormData({
        name: "",
        sum: "",
        subCategoryId: "",
        doctorId: "",
        createdAt: "",
      });
    } catch (error) {
      toast({
        title: "Ошибка при сохранении услуги.",
        description: error.response?.data?.message || "Попробуйте снова позже.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error("Ошибка при сохранении услуги:", error);
    }
  };

  const handleDeleteoffer = async (id) => {
    try {
      await axios.delete(`http://192.168.1.13:4000/offer/delete/${id}`);
      toast({
        title: "Подкатегория удалена.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      loadoffers();
    } catch (error) {
      toast({
        title: "Ошибка при удалении.",
        description: error.response?.data?.message || "Попробуйте снова позже.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error("Ошибка при удалении услуги:", error);
    }
  };

  const handleEditoffer = (offer) => {
    setIsEditing(true);
    setEditingId(offer.id);
    setFormData({
      name: offer.name,
      sum: offer.sum,
      subCategoryId: offer.subCategoryId || "",
      doctorId: offer.doctorId || "",
      createdAt: offer.createdAt || "",
    });
    onOpen();
  };
  const handleClose = () => {
    onClose();
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: "",
      sum: "",
      subCategoryId: "",
      doctorId: "",
      createdAt: "",
    });
  };

  return (
    <Box p={4} borderRadius="16px" w="100%" overflowX="auto" bg="#fff">
      <Flex justify="space-between" mb={4} gap={4}>
        <InputGroup w={{ base: "100%", md: "50%" }}>
          <Input
            placeholder="Поиск по любому параметру"
            color="black"
            _placeholder={{ color: "black" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            border="1px solid #000"
            pr="2.5rem"
          />
          <InputRightElement>
            <SearchIcon color="black.500" />
          </InputRightElement>
        </InputGroup>
        <Button w={"auto"} colorScheme="blue" onClick={onOpen}>
          Создать
        </Button>
      </Flex>

      <TableContainer overflowX="auto" width="100%">
        <Table variant="striped" size="sm" width="100%">
          <Thead position="sticky" top={0} zIndex={1} bg="white">
            <Tr>
              <Th>id</Th>
              <Th>Название услуги</Th>
              <Th>Стоимость услуги</Th>
              <Th>Под-категория</Th>
              <Th>Доктор</Th>
              <Th>Создан</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredoffers.map((offer) => (
              <Tr key={offer.id}>
                <Td>{offer.id}</Td>
                <Td>{offer.name}</Td>
                <Td>{offer.sum}</Td>
                <Td>{offer.subCategory.name}</Td>
                <Td>{offer.name}</Td>
                <Td>{new Date(offer.createdAt).toISOString().split("T")[0]}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="xs"
                      colorScheme="yellow"
                      onClick={() => handleEditoffer(offer)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="red"
                      onClick={() => handleDeleteoffer(offer.id)}
                    >
                      Удалить
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Модальное окно */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Создание услуги</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Название услуги</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Введите название услуги"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Стоимость услуги</FormLabel>
              <Input
                value={formData.sum}
                onChange={(e) =>
                  setFormData({ ...formData, sum: e.target.value })
                }
                placeholder="Стоимость услуги"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Принадлежность подкатегории</FormLabel>
              <Input
                value={formData.subCategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryId: e.target.value })
                }
                placeholder="Принадлежность подкатегории"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Доктор</FormLabel>
              <Select
                value={formData.doctorId}
                onChange={(e) =>
                  setFormData({ ...formData, doctorId: e.target.value })
                }
                placeholder="Выберите доктора"
              >
                {categories.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fullName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button colorScheme="blue" mr={3} onClick={handleCreateoffer}>
              {isEditing ? "Сохранить" : "Создать"}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Offers;
