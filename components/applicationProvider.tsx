"use client"

import { auth, db } from "@/lib/firebase/instances";
import { getClientes } from "@/lib/firebase/querys/getUser";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Loading } from "./loading";
import { OPTLogin } from "./OPTLogin";
import { ItemCarrinho, Usuario } from "@/types/usuario";

type ApplicationContextType = {
  userAuth: User | null;
  user: Usuario | null;
  carrinho: ItemCarrinho[] | null;
  loading: boolean;
  runQuery: () => void;
};

const ApplicationContext = createContext<ApplicationContextType>({} as ApplicationContextType);

export default function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuth(user);
      if (user) {
        getClientes(db, { id: user.uid }).then((e) => {
          if (e) {
            setUser(e);
          }
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userAuth]);


  const runQuery = useCallback(() => {
    if (user?.id)
      getClientes(db, { id: user?.id || "" }).then((e) => {
        if (e) {
          setUser(e);
          setCarrinho(e.carrinho);
        }
      });
  }, [user?.id]);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  const value = {
    userAuth,
    user,
    loading,
    carrinho,
    runQuery,
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