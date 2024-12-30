"use client"
import { useApplication } from "@/components/applicationProvider";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase/instances";
import { getPedidosByClienteId } from "@/lib/firebase/querys/getPedido";
import { Pedido } from "@/types/pedido";
import { Separator } from "@radix-ui/react-select";
import { LuMapPin } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function ListaPedidos() {
  const { user } = useApplication();
  const router = useRouter();

  const getPedido = async (): Promise<Pedido[]> => getPedidosByClienteId(db, { id: user?.id || "" });
  const query = useQuery({ queryKey: ["getPedidos"], queryFn: getPedido });
  const pedidos = query.data;

  return (
    <>
      <div>
        <div className="p-6">
          <div className="text-4xl font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
            Seus Pedidos
          </div>
          <Separator className="my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pedidos?.map((pedido, i) => (
              <Card
                key={pedido.id}
                className="cursor-pointer hover:shadow-xl transition ease-in-out delay-150"
                onClick={() => router.push(`pedido/${pedido.id}`)}
              >
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                    Pedido Nº {i}
                  </h3>
                  <div className="flex gap-2">
                    <span className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                      {pedido?.endereco?.rua}
                    </span>
                    <LuMapPin />
                  </div>
                  <p className="font-bold">
                    $
                    {(() => {
                      let vlr = 0;
                      pedido?.produtos?.forEach(
                        (e) => (vlr += e.quantidade * e.preco)
                      );
                      return vlr;
                    })().toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
