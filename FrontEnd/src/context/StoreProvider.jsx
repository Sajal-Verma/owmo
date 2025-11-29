// StoreProvider.js
import { createContext, useState } from "react";

export const store = createContext(); // export the context

function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  const loginUser = (userData) => {
    setUser(userData);
    setIsLogin(true);
  };

  const logoutUser = () => {
    setUser(null);
    setIsLogin(false);
  };

  return (
    <store.Provider value={{ user, isLogin, loginUser, logoutUser }}>
      {children}
    </store.Provider>
  );
}

export default StoreProvider;
