import { Box, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

function Reg({
  name,
  price,
  analise,
  clientId,
  diaId,
  labId,
  offerId,
  onSuccess,
}) {
  const toast = useToast();
  const hasCreated = useRef(false); // флаг

  useEffect(() => {
    const createRecord = async () => {
      try {
        let endpoint = "";
        let body = { name, clientId, price };

        if (labId) {
          endpoint = "http://localhost:4000/lab/new";
          body.labId = labId;
          body.analise = analise;
        } else if (diaId) {
          endpoint = "http://localhost:4000/dia/new";
          body.diaId = diaId;
          body.analise = analise;
        } else if (offerId) {
          endpoint = "http://localhost:4000/offer/new";
          body = { clientId, offerId, price, name };
        } else {
          return;
        }

        // Предотвращение повторной отправки
        if (hasCreated.current) return;
        hasCreated.current = true;

        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        toast({
          title: "Успешно",
          description: "Данные успешно сохранены",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onSuccess?.();
      } catch (error) {
        console.error("Ошибка при создании записи:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить данные",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (clientId && (labId || diaId || offerId)) {
      createRecord();
    }
  }, [clientId, diaId, labId, offerId, analise, name, price, onSuccess, toast]);

  return <Box display="none" />;
}

export default Reg;
