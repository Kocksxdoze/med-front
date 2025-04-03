const offersFetcher = async (url) => {
  const response = await fetch(`http://localhost:4000/${url}`);
  const data = await response.json();
  return data;
};
export default offersFetcher;
