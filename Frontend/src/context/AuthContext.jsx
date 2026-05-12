import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("elmore-user");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Migrate: ensure addresses array exists
    if (parsed && !parsed.addresses) {
      parsed.addresses = parsed.address ? [parsed.address] : [];
    }
    return parsed;
  });

  const login = (userData) => {
    // Ensure addresses array on login
    if (!userData.addresses) {
      userData.addresses = userData.address ? [userData.address] : [];
    }
    localStorage.setItem("elmore-user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("elmore-user");
    setUser(null);
  };

  // Update the primary address (keeps backward compat)
  const updateAddress = (address) => {
    const addresses = user?.addresses || [];
    // Add to list if not already there
    if (!addresses.includes(address)) {
      addresses.push(address);
    }
    const updated = { ...user, address, addresses };
    localStorage.setItem("elmore-user", JSON.stringify(updated));
    setUser(updated);
  };

  // Add a new address (without changing primary)
  const addAddress = (address) => {
    const addresses = [...(user?.addresses || [])];
    if (!addresses.includes(address)) {
      addresses.push(address);
    }
    const updated = { ...user, address, addresses }; // new one becomes primary
    localStorage.setItem("elmore-user", JSON.stringify(updated));
    setUser(updated);
  };

  // Set a specific address as primary
  const selectAddress = (address) => {
    const updated = { ...user, address };
    localStorage.setItem("elmore-user", JSON.stringify(updated));
    setUser(updated);
  };

  // Remove an address
  const removeAddress = (address) => {
    const addresses = (user?.addresses || []).filter(a => a !== address);
    const isPrimary = user?.address === address;
    const updated = {
      ...user,
      addresses,
      address: isPrimary ? (addresses[0] || "") : user.address,
    };
    localStorage.setItem("elmore-user", JSON.stringify(updated));
    setUser(updated);
  };

  // Update any field (gender, address, etc.)
  const updateUser = (fields) => {
    const updated = { ...user, ...fields };
    localStorage.setItem("elmore-user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      updateAddress, addAddress, selectAddress, removeAddress,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
