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


export default function Checkout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { user, carrinho, runQuery } = useApplication();
  const [open, setOpen] = useState(false);

  // useEffect(() => {

  // }, [carrinho]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] h-full sm:h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="carrinho" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="carrinho">Carrinho</TabsTrigger>
            <TabsTrigger value="endereco">Retirada</TabsTrigger>
            <TabsTrigger value="password">pagamento</TabsTrigger>
            <TabsTrigger value="password">Finalize</TabsTrigger>
          </TabsList>
          <TabsContent value="carrinho" className="h-[100%]">
            <CarrinhoCheckout />
          </TabsContent>
          <TabsContent value="endereco" className="h-[100%]">
            <EnderecoCheckout />
          </TabsContent>
          <TabsContent value="password" className="h-[100%]">
            Change your password here.
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
