"use client"
import { FormEndereco } from "./formEndereco";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { LuPlus } from "react-icons/lu";
import { Endereco } from "@/types/endereco";
import { useQuery } from "@/lib/firebase/firebaseQuery";
import { getEnderecosByUser } from "@/lib/firebase/querys/getEnderecosByUser";
import { db } from "@/lib/firebase/instances";
import { useAuth } from "./authProvider";

export function ListaEndereco() {
  const { user } = useAuth();
  const { data, loading } = useQuery<Endereco[], string>(
    getEnderecosByUser,
    db,
    user?.uid || ""
  );
  return (
    <div>
      <div className="flex items-start justify-center">
        <Card className="w-[500px] border-none shadow-none">
          <CardHeader className="">
            <div className="flex justify-between">
              <div className="font-semibold leading-none tracking-tight">
                Endereço
              </div>
              <FormEndereco>
                <Button type="submit" variant={"outline"}>
                  <LuPlus />
                </Button>
              </FormEndereco>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data?.map((address) => (
                <li key={address.id}>
                  <FormEndereco dados={address}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{address.rua}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Numero: {address.numero}
                              {address.bairro && `, ${address.cidade}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              {`${address.estado}, ${address.cidade}`}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-600">
                              {address.cep}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FormEndereco>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
