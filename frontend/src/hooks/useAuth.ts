// import { useState, createContext, useContext, ReactNode } from "react";
// import { loginUser } from "../services/auth";

// /**
//  * AuthContext provides authentication state and methods.
//  */
// interface AuthContextProps {
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// /**
//  * AuthProvider component wraps the application and provides authentication context.
//  * @param children - React children
//  */
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   /**
//    * Handles user login by calling the auth service.
//    * @param email - User email
//    * @param password - User password
//    */
//   const login = async (email: string, password: string) => {
//     // Implement authentication logic, e.g., API call
//     await loginUser(email, password);
//     setIsAuthenticated(true);
//   };

//   /**
//    * Handles user logout by resetting authentication state.
//    */
//   const logout = () => {
//     // Implement logout logic, e.g., clearing tokens
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// /**
//  * useAuth hook provides access to authentication context.
//  * @returns AuthContextProps
//  */
// const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// export default useAuth;
