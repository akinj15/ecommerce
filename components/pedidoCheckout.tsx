"use client";

import { Button } from "@/components/ui/button";
// import { useApplication } from "./applicationProvider";
// import { db } from "@/lib/firebase/instances";
import { NovoPedido } from "@/types/pedido";
import { Separator } from "@/components/ui/separator";
import { LuCreditCard, LuMapPin, LuTruck } from "react-icons/lu";
import { FaPix } from "react-icons/fa6";
import { CiMoneyBill } from "react-icons/ci";
import { useApplication } from "./applicationProvider";
import { db } from "@/lib/firebase/instances";
import { finalizaPedidoByIdCliente } from "@/lib/firebase/querys/setUSer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IPedidoCheckout {
  fechaModal: () => void;
  setProximo: (
    e: "carrinho" | "endereco" | "pagamento" | "flinalização"
  ) => void;
  pedido: NovoPedido | null;
}

export default function PedidoCheckout({
  pedido,
  setProximo,
  fechaModal,
}: IPedidoCheckout) {
  const { user, carrinho, runQuery } = useApplication();
  const produtos = pedido?.produtos;
  const endereco = pedido?.endereco;
  const pagamento = pedido?.pagamento;
  const custoTotal = (() => {
    let precoTotal = 0;
    produtos?.forEach((e) => (precoTotal += e.preco * e.quantidade));
    return precoTotal;
  })();

  const voltar = () => {
    setProximo("pagamento");
  };

  const finalizaPedido = () => {
    if (pedido && carrinho) {
      finalizaPedidoByIdCliente(db, carrinho, user?.id || "", pedido).then(
        () => {
          fechaModal();
          runQuery();
        }
      );
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="min-h-max rounded-md">
        <div className="overflow-auto ">
          <div className="mb-4 font-semibold">Itens:</div>
          {produtos?.map((item) => (
            <>
              <div
                key={item.id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <h4 className="font-medium">{item.nome}</h4>
                  <p className="text-sm text-gray-500">
                    Quantidade: {item.quantidade}
                  </p>
                </div>
                <p className="font-medium">
                  ${(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
              <Separator />
            </>
          ))}
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

          <div className="flex justify-between items-center mt-8 font-semibold">
            <span>Total:</span>
            <span>${custoTotal.toFixed(2)}</span>
          </div>
        </div>
      </ScrollArea>

      <Separator />
      <div className="flex justify-between mt-auto">
        <Button className="" variant="ghost" onClick={() => voltar()}>
          voltar
        </Button>

        <Button className="" onClick={() => finalizaPedido()}>
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
}
