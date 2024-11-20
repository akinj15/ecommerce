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


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarrinhoCheckout from "@/components/carrinhoCheckout";
import EnderecoCheckout from "@/components/enderecoCheckout";
import PagamentoCheckout from "@/components/pagamentoCheckout";
import { NovoPedido } from "@/types/pedido";

export default function Checkout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { user, carrinho, runQuery } = useApplication();
  const [open, setOpen] = useState(false);
  const [pedido, setPedido] = useState<NovoPedido | null>(null);
  const [estadoTab, setEstadoTab] = useState<
    "carrinho" | "endereco" | "pagamento" | "flinalização"
  >("carrinho");


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] h-full sm:h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="carrinho" value={estadoTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="carrinho"
              onClick={() => setEstadoTab("carrinho")}
            >
              Carrinho
            </TabsTrigger>
            <TabsTrigger
              value="endereco"
              onClick={() => setEstadoTab("endereco")}
            >
              Retirada
            </TabsTrigger>
            <TabsTrigger
              value="pagamento"
              onClick={() => setEstadoTab("pagamento")}
            >
              pagamento
            </TabsTrigger>
            <TabsTrigger
              value="flinalização"
              onClick={() => setEstadoTab("flinalização")}
            >
              Finalize
            </TabsTrigger>
          </TabsList>
          <TabsContent value="carrinho" className="h-[100%]">
            <CarrinhoCheckout
              pedido={pedido}
              setPedido={setPedido}
              setProximo={setEstadoTab}
            />
          </TabsContent>
          <TabsContent value="endereco" className="h-[100%]">
            <EnderecoCheckout
              pedido={pedido}
              setPedido={setPedido}
              setProximo={setEstadoTab}
            />
          </TabsContent>
          <TabsContent value="pagamento" className="h-[100%]">
            <PagamentoCheckout
              pedido={pedido}
              setPedido={setPedido}
              setProximo={setEstadoTab}
            />
          </TabsContent>
          <TabsContent value="flinalização" className="h-[100%]">
            <PagamentoCheckout />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
