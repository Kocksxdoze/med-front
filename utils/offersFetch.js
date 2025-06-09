const offersFetcher = async (url) => {
  const response = await fetch(`http://192.168.1.11:4000/${url}`);
  const data = await response.json();
  return data;
};
export default offersFetcher;
