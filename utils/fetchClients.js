const fetchClients = async () => {
  const response = await fetch("http://localhost:4000/clients");
  return response.data;
};

export default fetchClients;
