// import { useState } from "react";
//
// function Register({ onRegister }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("BUYER");
//   const [message, setMessage] = useState("");
//
//   const registerUser = async (e) => {
//     e.preventDefault();
//
//     setMessage("");
//
//     try {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//
//         headers: {
//           "Content-Type": "application/json",
//         },
//
//         body: JSON.stringify({
//           email,
//           password,
//           role,
//         }),
//       });
//
//       const data = await response.text();
//
//       if (response.ok) {
//         setMessage("Registration successful!");
//
//         setEmail("");
//         setPassword("");
//         setRole("BUYER");
//
//         if (onRegister) {
//           onRegister();
//         }
//       } else {
//         setMessage(data || "Registration failed");
//       }
//     } catch {
//       setMessage("Server connection failed");
//     }
//   };
//
//   return (
//     <div className="auth-card">
//       <h2>Create Account</h2>
//
//       <p className="auth-subtitle">
//         Register to start using RevertPay.
//       </p>
//
//       {message && (
//         <div className="message">
//           {message}
//         </div>
//       )}
//
//       <form onSubmit={registerUser}>
//         <label>Email</label>
//
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//
//         <label>Password</label>
//
//         <input
//           type="password"
//           placeholder="Create a password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//
//         <label>Role</label>
//
//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="BUYER">BUYER</option>
//           <option value="SELLER">SELLER</option>
//           <option value="ADMIN">ADMIN</option>
//         </select>
//
//         <button className="primary-btn" type="submit">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }
//
// export default Register;