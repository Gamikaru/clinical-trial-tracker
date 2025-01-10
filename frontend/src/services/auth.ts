// import axios from "axios";

// /**
//  * AuthService handles authentication-related API interactions.
//  */
// const authApi = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "https://your-auth-api.com",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /**
//  * Logs in a user with the provided credentials.
//  * @param email - User email
//  * @param password - User password
//  * @returns Promise resolving to authentication token or user data
//  */
// export const loginUser = async (email: string, password: string) => {
//   try {
//     const response = await authApi.post("/login", { email, password });
//     const { token } = response.data;

//     // Store token in localStorage or cookies
//     localStorage.setItem("authToken", token);
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Login failed");
//   }
// };

// /**
//  * Logs out the current user by removing the authentication token.
//  */
// export const logoutUser = () => {
//   localStorage.removeItem("authToken");
// };
