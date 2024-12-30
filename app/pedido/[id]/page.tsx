"use client"
import { useApplication } from "@/components/applicationProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase/instances";
import { getPedidoById } from "@/lib/firebase/querys/getPedido";
import { Pedido } from "@/types/pedido";
import { use } from "react";
import { CiMoneyBill } from "react-icons/ci";
import { FaPix } from "react-icons/fa6";
import { LuCreditCard, LuMapPin, LuTruck } from "react-icons/lu";
import {
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";

export default function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = use(params);
  const { user } = useApplication();

  const getPedido = async (): Promise<Pedido> =>
    getPedidoById(db, {
      id: param?.id || "",
      idCliente: user?.id || "",
    });

  const query = useQuery({ queryKey: ["getPedido"], queryFn: getPedido });
  const pedido = query.data;

  const custoTotal = (() => {
    let precoTotal = 0;
    pedido?.produtos?.forEach((e) => (precoTotal += e.preco * e.quantidade));
    return precoTotal;
  })();

  return (
    <>
      <div className="h-full flex flex-col p-6">
        <div className="mb-4 font-semibold">Itens:</div>
        {pedido?.produtos?.map((item) => (
          <div key={item.id + "Final"}>
            <div className="flex justify-between items-center mb-4">
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
        {pedido?.endereco && (
          <div>
            <div className="my-4 font-semibold">
              <LuTruck className="mr-2 h-8 w-8" /> Endererço:
            </div>
            <div className="flex items-center justify-between">
              <div className="">
                <h3 className="font-semibold">
                  {pedido?.endereco.rua + " - " + pedido?.endereco.numero}
                </h3>
                <p className="text-sm text-gray-500">
                  {`${pedido?.endereco.bairro} - ${pedido?.endereco.cidade}`}
                </p>
              </div>
              <div>
                <LuMapPin />
              </div>
            </div>
            <Separator />
          </div>
        )}

        {pedido?.pagamento && (
          <div>
            <div className="my-4 font-semibold">
              <LuCreditCard className="mr-2 h-8 w-8" /> Pagamento:
            </div>
            <div className="flex items-center justify-between">
              <div className="">
                <h3 className="font-semibold">{pedido?.pagamento}</h3>
                <p className="text-sm text-gray-500">
                  ${custoTotal.toFixed(2)}
                </p>
              </div>
              <div>
                {pedido?.pagamento == "Pix" && <FaPix />}
                {pedido?.pagamento == "Dinheiro" && <CiMoneyBill />}
                {(pedido?.pagamento == "Credito" ||
                  pedido?.pagamento == "Debito") && <LuCreditCard />}
              </div>
            </div>
          </div>
        )}
        <Separator />

        <div className="flex justify-between items-center mt-8 font-semibold">
          <span>Total:</span>
          <span>${custoTotal.toFixed(2)}</span>
        </div>

        <div className="mt-4">
          <Link href={"/pedido"}>
            <Button className="w-full">voltar</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
