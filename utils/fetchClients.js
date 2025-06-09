const fetchClients = async () => {
  const response = await fetch("http://192.168.1.11:4000/clients");
  const data = await response.json();
  return data;
};

export default fetchClients;
