"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// import { useApplication } from "./applicationProvider";
import { useState } from "react";

import CarrinhoCheckout from "@/components/carrinhoCheckout";
import EnderecoCheckout from "@/components/enderecoCheckout";
import PagamentoCheckout from "@/components/pagamentoCheckout";
import { NovoPedido } from "@/types/pedido";
import PedidoCheckout from "./pedidoCheckout";
import { LuCreditCard, LuPackage, LuTruck } from "react-icons/lu";

export default function Checkout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { user, carrinho, runQuery } = useApplication();
  const [open, setOpen] = useState(false);
  const [pedido, setPedido] = useState<NovoPedido | null>(null);
  const [inicioPedido, setInicioPedido] = useState(true);

  const [estadoTab, setEstadoTab] = useState<
    "carrinho" | "endereco" | "pagamento" | "flinalização"
  >("carrinho");


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] h-svh sm:h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Finelize seu Pedido</DialogTitle>
        </DialogHeader>

        {inicioPedido && (
          <CarrinhoCheckout
            pedido={pedido}
            setPedido={setPedido}
            setProximo={setEstadoTab}
            setVoltaInicio={setInicioPedido}
          />
        )}
        {!inicioPedido && (
          <>
            <div className="flex justify-between">
              {estadoTab === "endereco" && (
                <>
                  <div>
                    <LuTruck className="mr-2 h-8 w-8" /> Endererço
                  </div>
                </>
              )}
              {estadoTab === "pagamento" && (
                <>
                  <div>
                    <LuCreditCard className="mr-2 h-8 w-8" /> Pagamento
                  </div>
                </>
              )}
              {estadoTab === "flinalização" && (
                <>
                  <div>
                    <LuPackage className="mr-2 h-8 w-8" /> Finalizar
                  </div>
                </>
              )}
            </div>

            {estadoTab === "endereco" && (
              <EnderecoCheckout
                pedido={pedido}
                setPedido={setPedido}
                setProximo={setEstadoTab}
                setVoltaInicio={setInicioPedido}
              />
            )}

            {estadoTab === "pagamento" && (
              <PagamentoCheckout
                pedido={pedido}
                setPedido={setPedido}
                setProximo={setEstadoTab}
              />
            )}

            {estadoTab === "flinalização" && (
              <PedidoCheckout
                pedido={pedido}
                setPedido={setPedido}
                setProximo={setEstadoTab}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
