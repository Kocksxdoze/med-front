const fetchClients = async () => {
  const response = await fetch("http://192.168.1.13:4000/clients");
  const data = await response.json();
  return data;
};

export default fetchClients;
