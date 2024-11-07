"use client"

import { auth, db } from "@/lib/firebase/instances";
import { getClientes } from "@/lib/firebase/querys/getUser";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Loading } from "./loading";
import { OPTLogin } from "./OPTLogin";

type AuthContextType = {
  user: User | null;
  userPhone: object | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, userPhone: {}, loading: false });


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userPhone, setUserPhone] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        if (user) {
          getClientes(db, { id: user.uid }, setUserPhone, setLoading);
        } else {
          setLoading(false);
        }
    });

    return () => unsubscribe();
  }, [user]);

  const value = {
    user, 
    userPhone,
    loading,
  };
  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return <AuthContext.Provider value={value}><OPTLogin /></AuthContext.Provider>;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);