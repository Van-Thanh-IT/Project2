// // AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
