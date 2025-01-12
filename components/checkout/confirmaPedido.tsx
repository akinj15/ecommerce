"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/instances";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApplication } from "../applicationProvider";
import { useToast } from "@/hooks/use-toast";

import { NovoPedido, Pedido } from "@/types/pedido";
import { finalizaPedidoByIdCliente } from "@/lib/firebase/querys/setUSer";
import { LuCreditCard, LuMapPin, LuTruck } from "react-icons/lu";
import { Separator } from "../ui/separator";
import { FaPix } from "react-icons/fa6";
import { CiMoneyBill } from "react-icons/ci";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ConfirmaPedido({
  children,
  dados,
  fechaModal,
}: Readonly<{
  children: React.ReactNode;
  dados: NovoPedido | null;
  fechaModal: () => void;
}>) {
  const router = useRouter();
  const [openForm, setOpenForm] = useState(false);
  const { user, runQuery, carrinho } = useApplication();
  const { toast } = useToast();
  const endereco = dados?.endereco;
  const pagamento = dados?.pagamento;
  const custoTotal = (() => {
    let precoTotal = 0;
    dados?.produtos?.forEach((e) => (precoTotal += e.preco * e.quantidade));
    return precoTotal;
  })();

  const finalizaPedido = () => {
    if (dados && carrinho && user) {
      const dadosEnvio: Pedido = {
        emissao: new Date(),
        status: { codigo: "novo", nome: "Pedido" },
        endereco: dados.endereco,
        pagamento: dados.pagamento,
        produtos: dados.produtos,
        cliente: {
          chave: user.chave || 0,
          cpf: user.cpf,
          nome: user.nome,
          id: user.id || "",
          telefone: user.telefone,
        },
      };
      finalizaPedidoByIdCliente(db, carrinho, user?.id || "", dadosEnvio)
        .then((e) => {
          fechaModal();
          runQuery();
          toast({
            title: "Sucesso",
            className: cn(
              "botton-0 left-0"
            ),
          });
          router.push("/pedido/" + e);
        })
        .catch((e) => {
          console.log(e)
          toast({
            title: "Falha na criação do pedido",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
        </DialogHeader>
        <div>
          {endereco && (
            <>
              <div className="my-4 font-semibold">
                <LuTruck className="mr-2 h-8 w-8" /> Endererço:
              </div>
              <div className="flex items-center justify-between">
                <div className="">
                  <h3 className="font-semibold">
                    {endereco.rua + " - " + endereco.numero}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {`${endereco.bairro} - ${endereco.cidade}`}
                  </p>
                </div>
                <div>
                  <LuMapPin />
                </div>
              </div>
              <Separator />
            </>
          )}
          {pagamento && (
            <>
              <div className="my-4 font-semibold">
                <LuCreditCard className="mr-2 h-8 w-8" /> Pagamento:
              </div>
              <div className="flex items-center justify-between">
                <div className="">
                  <h3 className="font-semibold">{pagamento}</h3>
                  <p className="text-sm text-gray-500">
                    ${custoTotal.toFixed(2)}
                  </p>
                </div>
                <div>
                  {pagamento == "Pix" && <FaPix />}
                  {pagamento == "Dinheiro" && <CiMoneyBill />}
                  {(pagamento == "Credito" || pagamento == "Debito") && (
                    <LuCreditCard />
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}
        </div>
        <DialogFooter>
          <Button className="" onClick={() => finalizaPedido()}>
            Finalizar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
