import { RegisterUser } from "./types/user";

export async function apiClient(data: RegisterUser) {
  const response = await fetch("http://localhost:5000/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const result = await response.json();
  console.log(result);
  return result;
}
