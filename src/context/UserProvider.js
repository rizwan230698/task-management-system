import React, { useState, useCallback } from "react";
import { auth } from "../firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const setUser = useCallback((user) => {
    const data = user ? { name: user.displayName, email: user.email } : null;

    localStorage.setItem("user", JSON.stringify(data));
    setCurrentUser(data);
  }, []);

  const removeUser = () => {
    localStorage.removeItem("user");
    auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, setUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};
