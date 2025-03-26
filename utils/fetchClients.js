const fetchClients = async () => {
  const response = await fetch("http://localhost:4000/clients");
  const data = await response.json(); // Преобразуем в JSON
  return data;
};

export default fetchClients;
