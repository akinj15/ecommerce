"use client";

import { Button } from "@/components/ui/button";
import { useApplication } from "./applicationProvider";
import { FormEndereco } from "./formEndereco";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "./ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LuMoreVertical } from "react-icons/lu";

export default function EnderecoCheckout() {
  const { endereco, estabelecimentos } = useApplication();
  const [ehRetirada, setEhRetirada] = useState(false);
  const [ehEntrga, setEhEntrga] = useState(false);

  const onChangeRetirada = (e: boolean | "indeterminate") => {
    if (typeof e == "boolean") {
      if (e && ehEntrga) {
        setEhEntrga(false);
      }
      setEhRetirada(e);
    }
  };

  const onChangeEntrega = (e: boolean | "indeterminate") => {
    if (typeof e == "boolean") {
      if (e && ehRetirada) {
        setEhRetirada(false);
      }
      setEhEntrga(e);
    }
  };

  return (
    <div className="mt-4 h-full pb-[4.6rem]">
      <Card className="">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="entrega"
                checked={ehEntrga}
                onCheckedChange={(e) => onChangeEntrega(e)}
              />
              <label htmlFor="entrega" className="">
                Entrega
              </label>
            </div>
          </CardTitle>
          <CardDescription>
            Não há endereço cadastrado, cadastre o novo endereço aqui.
          </CardDescription>
        </CardHeader>
        {endereco?.length ? (
          <>
            <CardContent>
              <FormEndereco dados={endereco[0]}>
                <div className="flex items-center justify-between">
                  <div className="">
                    <h3 className="font-semibold">
                      {endereco[0].rua + " - " + endereco[0].numero}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {`${endereco[0].bairro} - ${endereco[0].cidade}`}
                    </p>
                  </div>
                  <div>
                    <LuMoreVertical />
                  </div>
                </div>
              </FormEndereco>
            </CardContent>
          </>
        ) : (
          <>
            <CardFooter className="">
              <FormEndereco>
                <Button className="w-full" disabled={!ehEntrga}>
                  Cadastre um novo endereço
                </Button>
              </FormEndereco>
            </CardFooter>
          </>
        )}
      </Card>

      <Card className="my-4">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="retirada"
                checked={ehRetirada}
                onCheckedChange={(e) => onChangeRetirada(e)}
              />
              <label htmlFor="retirada" className="">
                Retirada
              </label>
            </div>
          </CardTitle>
          <CardDescription>
            Selecione qual estabelecimento irá ser retirado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select disabled={!ehRetirada}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Retirada" />
            </SelectTrigger>
            <SelectContent>
              {estabelecimentos?.map((e) => {
                return (
                  <>
                    <SelectItem key={e.id} value={e.id}>{e.codigo}</SelectItem>
                  </>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
