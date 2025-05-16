"use client";

import { useState, useEffect } from "react";
import { Box, Button, Text, VStack, HStack, Collapse } from "@chakra-ui/react";
import fetcher from "../../utils/fetcher"; // если используешь свой fetcher

const Registration = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetcher("categories");
        setCategories(data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
    setExpandedSubcategory(null); // сбрасываем подкатегорию
  };

  const toggleSubcategory = (id) => {
    setExpandedSubcategory(expandedSubcategory === id ? null : id);
  };

  return (
    <Box my={10}>
      <VStack spacing={4}>
        {categories.map((category) => (
          <Box key={category.id}>
            <Button
              w="100%"
              onClick={() => toggleCategory(category.id)}
              color={"#000"}
              border={"1px solid #000"}
              fontWeight={"400"}
              fontSize={"20px"}
              variant="ghost"
              _hover={{
                color: "#fff",
                background: "#0052b4",
                border: "1px solid transparent",
              }}
            >
              {category.categoryName}
            </Button>

            <Collapse in={expandedCategory === category.id} animateOpacity>
              <VStack align="start" pl={5} mt={2} spacing={3}>
                {category.subcategories?.map((sub) => (
                  <Box key={sub.id}>
                    <Button
                      fontSize={"17px"}
                      variant="ghost"
                      onClick={() => toggleSubcategory(sub.id)}
                      color={"#000"}
                      border={"1px solid #000"}
                      fontWeight={"400"}
                      _hover={{
                        color: "#fff",
                        background: "#0052b4",
                        border: "1px solid transparent",
                      }}
                    >
                      {sub.name}
                    </Button>

                    <Collapse
                      in={expandedSubcategory === sub.id}
                      animateOpacity
                    >
                      <VStack align="start" pl={5} mt={2}>
                        {sub.offers?.map((offer) => (
                          <Text key={offer.id} fontSize={"17px"} pl={2}>
                            {offer.name}
                          </Text>
                        ))}
                      </VStack>
                    </Collapse>
                  </Box>
                ))}
              </VStack>
            </Collapse>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Registration;
