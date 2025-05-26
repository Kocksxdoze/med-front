"use client";

import { useState, useEffect } from "react";
import { Box, Button, Text, VStack, Collapse, HStack } from "@chakra-ui/react";
import fetcher from "../../utils/fetcher";

const Registration = ({ onSelectOffer }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cat] = await Promise.all([fetcher("categories")]);
        setCategories(cat);
      } catch (err) {
        console.error("Ошибка загрузки категорий", err);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
    setExpandedSubcategory(null);
  };

  const toggleSubcategory = (id) => {
    setExpandedSubcategory(expandedSubcategory === id ? null : id);
  };

  return (
    <Box my={10}>
      <VStack spacing={4}>
        {categories.map((category) => (
          <Box key={category.id} w="100%">
            <Button
              w="100%"
              onClick={() => toggleCategory(category.id)}
              color="#000"
              border="1px solid #000"
              fontWeight="400"
              fontSize="20px"
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
                  <Box key={sub.id} w="100%">
                    <Button
                      fontSize="17px"
                      variant="ghost"
                      onClick={() => toggleSubcategory(sub.id)}
                      color="#000"
                      border="1px solid #000"
                      fontWeight="400"
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
                          <HStack key={offer.id} spacing={4}>
                            <Text fontSize="17px">
                              {offer.name} — {offer.sum} сум
                            </Text>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => onSelectOffer(offer)}
                            >
                              Выбрать
                            </Button>
                          </HStack>
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
