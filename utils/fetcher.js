import Cookies from "js-cookie";

export default async function fetcher(url) {
  const response = await fetch(`http://localhost:4000/${url}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  return response.data;
}
