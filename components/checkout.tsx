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

  const fechaModal = () => {
    setInicioPedido(true);
    setPedido(null)
    setOpen(false);
  }

  const openChange = (e: boolean) => {
    if (!e) {
      setPedido(null);
      setInicioPedido(true);
    }
    setOpen(e);
  };

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] h-svh sm:h-[80%] flex flex-col gap-0">
        <DialogHeader>
          <DialogTitle></DialogTitle>
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
                fechaModal={fechaModal}
                setProximo={setEstadoTab}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
