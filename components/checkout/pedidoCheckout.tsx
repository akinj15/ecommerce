"use client";

import { Button } from "@/components/ui/button";
// import { useApplication } from "./applicationProvider";
// import { db } from "@/lib/firebase/instances";
import { NovoPedido } from "@/types/pedido";
import { Separator } from "@/components/ui/separator";
import { LuCreditCard, LuMapPin, LuPackage, LuTruck } from "react-icons/lu";
import { FaPix } from "react-icons/fa6";
import { CiMoneyBill } from "react-icons/ci";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmaPedido } from "./confirmaPedido";

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

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 ">
        <LuPackage className="mr-2 h-8 w-8" /> Finalizar
      </div>
      <ScrollArea key={"mopa23232"} className="my-4 px-4 h-full">
        <div className="mb-4 font-semibold">Itens:</div>
        {produtos?.map((item) => (
          <div key={item.id + "Final"}>
            <div
              
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
          </div>
        ))}
        {endereco && (
          <div>
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
          </div>
        )}

        {pagamento && (
          <div>
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
          </div>
        )}

        <div className="flex justify-between items-center mt-8 font-semibold">
          <span>Total:</span>
          <span>${custoTotal.toFixed(2)}</span>
        </div>
      </ScrollArea>

      {/* <Separator /> */}

      <div className="shrink-0 flex justify-between mt-4">
        <Button className="" variant="ghost" onClick={() => voltar()}>
          voltar
        </Button>
        <ConfirmaPedido dados={pedido || null} fechaModal={fechaModal}>
          <Button className="">Finalizar Pedido</Button>
        </ConfirmaPedido>
      </div>
    </div>
  );
}
