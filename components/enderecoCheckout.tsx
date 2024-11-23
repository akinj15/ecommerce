"use client";

import { Button } from "@/components/ui/button";
import { useApplication } from "./applicationProvider";
import { FormEndereco } from "./formEndereco";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "./ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LuMoreVertical, LuTruck } from "react-icons/lu";
import { NovoPedido } from "@/types/pedido";

interface IEnderecoCheckout {
  setPedido: (e: NovoPedido) => void;
  setVoltaInicio: (e: boolean) => void;
  setProximo: (
    e: "carrinho" | "endereco" | "pagamento" | "flinalização"
  ) => void;
  pedido: NovoPedido | null;
}

export default function EnderecoCheckout({
  setPedido,
  pedido,
  setProximo,
  setVoltaInicio,
}: IEnderecoCheckout) {
  const { endereco, estabelecimentos } = useApplication();
  const [ehRetirada, setEhRetirada] = useState(false);
  const [ehEntrga, setEhEntrga] = useState(false);
  const [lugarRetirada, setLugarRetirada] = useState("");

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

  const finalizaEndereco = () => {
    let enderecoFinal;
    if (ehEntrga && endereco && endereco[0]) {
      enderecoFinal = endereco[0];
    }
    if (!enderecoFinal) {
      return;
    }
    setPedido({
      produtos: pedido?.produtos || null,
      endereco: enderecoFinal,
      pagamento: pedido?.pagamento || null,
    });
    setProximo("pagamento");
  };

  const voltar = () => {
    setVoltaInicio(true);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="shrink-0 flex items-center gap-4">
          <LuTruck className="mr-2 h-12 w-12" />{" "}
          <div className="text-center font-semibold">Endererço</div>
        </div>
        <div className="h-full my-4">
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
              <Select
                disabled={!ehRetirada}
                value={lugarRetirada}
                onValueChange={(e) => setLugarRetirada(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Retirada" />
                </SelectTrigger>
                <SelectContent>
                  {ehRetirada &&
                    estabelecimentos?.map((e) => {
                      return (
                        <>
                          <SelectItem key={e.id} value={e.id}>
                            {e.codigo}
                          </SelectItem>
                        </>
                      );
                    })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
        <div className="shrink-0 ">
          <div className="flex justify-between">
            <Button className="" variant="ghost" onClick={() => voltar()}>
              Carrinho
            </Button>

            <Button className="" onClick={() => finalizaEndereco()}>
              Selecionar Endereço
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
