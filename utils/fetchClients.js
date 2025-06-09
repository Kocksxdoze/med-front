const fetchClients = async () => {
  const response = await fetch("http://0.0.0.0:4000/clients");
  const data = await response.json();
  return data;
};

export default fetchClients;
