"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, } from "./ui/card";
import { useState } from "react";
import { NovoPedido } from "@/types/pedido";
import { LuCreditCard } from "react-icons/lu";


const formasPagamentos = ["Pix", "Dinheiro", "Credito", "Debito"];

interface IPagamentoCheckout {
  setPedido: (e: NovoPedido) => void;
  setProximo: (
    e: "carrinho" | "endereco" | "pagamento" | "flinalização"
  ) => void;
  pedido: NovoPedido | null;
}

export default function PagamentoCheckout({
  setPedido,
  pedido,
  setProximo,
}: IPagamentoCheckout) {
  // const { endereco, estabelecimentos } = useApplication();
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");

  const selecionaPagamento = (e: string) => {
    setPagamentoSelecionado(e);
  };

  const finalizaEndereco = () => {
    if (pagamentoSelecionado) {
      const novoPedido = {
        endereco: pedido?.endereco || null,
        produtos: pedido?.produtos || null,
        pagamento: pagamentoSelecionado || null,
      };
      setPedido(novoPedido);
      setProximo("flinalização");
    }
  };
  const voltar = () => {
    setProximo("endereco");
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="shrink-0 flex items-center gap-4">
          <LuCreditCard className="mr-2 h-12 w-12" />{" "}
          <div className="text-center font-semibold">Pagamento</div>
        </div>
        <div className="h-full my-4">
          {formasPagamentos.map((e) => {
            return (
              <div key={e}>
                <Card
                  className={
                    pagamentoSelecionado == e
                      ? "my-4 shadow-primary transition ease-in-out delay-150"
                      : "my-4 transition ease-in-out delay-150"
                  }
                  onClick={() => selecionaPagamento(e)}
                >
                  <CardHeader>
                    <CardTitle>{e}</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="shrink-0">
          <div className="flex justify-between">
            <Button className="" variant="ghost" onClick={() => voltar()}>
              voltar
            </Button>

            <Button className="" onClick={() => finalizaEndereco()}>
              Selecionar Pagamento
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
