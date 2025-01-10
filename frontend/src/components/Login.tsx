// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

// /**
//  * Login component provides user authentication functionality.
//  */
// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   // State for form inputs
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   /**
//    * Handles the login form submission.
//    * @param e Form event
//    */
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       await login(email, password);
//       navigate("/dashboard");
//     } catch (err: any) {
//       setError(err.message || "Failed to login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="card bg-base-100 shadow-md p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="label">
//               <span className="label-text">Email</span>
//             </label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="input input-bordered w-full"
//               placeholder="Enter your email"
//             />
//           </div>
//           <div>
//             <label className="label">
//               <span className="label-text">Password</span>
//             </label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="input input-bordered w-full"
//               placeholder="Enter your password"
//             />
//           </div>
//           <button
//             type="submit"
//             className="btn btn-primary w-full"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
