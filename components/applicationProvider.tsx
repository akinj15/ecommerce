"use client"

import { auth, db } from "@/lib/firebase/instances";
import { getClientes } from "@/lib/firebase/querys/getUser";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Loading } from "./loading";
import { OPTLogin } from "./OPTLogin";
import { Usuario } from "@/types/usuario";

type ApplicationContextType = {
  userAuth: User | null;
  user: Usuario | null;
  loading: boolean;
};

const ApplicationContext = createContext<ApplicationContextType>({} as ApplicationContextType);

export default function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuth(user);
      if (user) {
        getClientes(db, { id: user.uid }, setUser, setLoading);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userAuth]);

  const value = {
    userAuth,
    user,
    loading,
  };
  if (loading) { 
    return <Loading />;
  }
  if (!userAuth) {
    return (
      <ApplicationContext.Provider value={value}>
        <OPTLogin />
      </ApplicationContext.Provider>
    );
  }
  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}
export const useApplication = () => useContext(ApplicationContext);