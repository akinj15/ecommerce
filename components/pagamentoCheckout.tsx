"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, } from "./ui/card";
import { useState } from "react";
import { NovoPedido } from "@/types/pedido";


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
    <div className="mt-4 h-full grid content-between ">
      <div className="">
        {formasPagamentos.map((e) => {
          return (
            <>
              <Card
                className={
                  pagamentoSelecionado == e ? "my-4 shadow-xl" : "my-4"
                }
                key={e}
                onClick={() => selecionaPagamento(e)}
              >
                <CardHeader>
                  <CardTitle>{e}</CardTitle>
                </CardHeader>
              </Card>
            </>
          );
        })}
      </div>

      <div className="mt-auto">
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
  );
}
