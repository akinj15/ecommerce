"use client";

import { Button } from "@/components/ui/button";
import { LuPlus, LuMinus, LuX } from "react-icons/lu";
import { useApplication } from "./applicationProvider";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/instances";
import { ItemCarrinho } from "@/types/usuario";
import {
  deleteItemCarrinhoByIdCliente,
  updateItemCarrinhoByIdCliente,
} from "@/lib/firebase/querys/setUSer";
import { LuShoppingCart } from "react-icons/lu";

import Image from "next/image";
import semImagem from "../public/imagens/semImagem.png";
import { NovoPedido } from "@/types/pedido";

// Define the structure of a cart item
interface CartItem {
  imgUrl: string;
  chave: number;
  nome: string;
  preco: number;
  quantidade: number;
}

// CartItem component to display individual items
const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) => (
  <div className="flex items-center justify-between py-2 border-b p-1">
    <div className="space-y-4">
      <Image
        src={item.imgUrl.replace("http://", "https://") || semImagem}
        alt={item.nome}
        width={200}
        height={200}
        className="w-[40px] h-auto object-cover rounded-lg mr-2"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold">{item.nome}</h3>
      <p className="text-sm text-gray-500">
        ${(item.preco * item.quantidade).toFixed(2)}
      </p>
    </div>
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrease}
        disabled={item.quantidade === 1}
      >
        <LuMinus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center">{item.quantidade}</span>
      <Button variant="outline" size="icon" onClick={onIncrease}>
        <LuPlus className="h-4 w-4" />
      </Button>
      <Button variant="destructive" size="icon" onClick={onRemove}>
        <LuX className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

interface ICarrinhoCheckout {
  setPedido: (e: NovoPedido) => void;
  setVoltaInicio: (e: boolean) => void;
  setProximo: (
    e: "carrinho" | "endereco" | "pagamento" | "flinalização"
  ) => void;
  pedido: NovoPedido | null;
}

export default function CarrinhoCheckout({
  setPedido,
  pedido,
  setProximo,
  setVoltaInicio,
}: ICarrinhoCheckout) {
  const { user, carrinho, runQuery } = useApplication();
  const [custoTotal, setCustoTotal] = useState(0);

  useEffect(() => {
    if (carrinho && carrinho.length) {
      let valor = 0;

      carrinho.forEach((item) => {
        valor += item.quantidade * item.preco;
      });
      setCustoTotal(valor);
    }
  }, [carrinho]);

  const atualizaQuantidade = (carrinho: ItemCarrinho, valor: number) => {
    const novoCarrinho = { ...carrinho };

    if (novoCarrinho.quantidade + valor >= 1) {
      novoCarrinho.quantidade += valor;
    }

    updateItemCarrinhoByIdCliente(
      db,
      user?.id || "",
      carrinho.id,
      novoCarrinho
    ).then(() => runQuery());
  };

  const removeItem = (id: string) => {
    deleteItemCarrinhoByIdCliente(db, user?.id || "", id).then(() =>
      runQuery()
    );
  };

  const finalizaCarrinho = () => {
    setPedido({
      produtos: carrinho,
      endereco: pedido?.endereco || null,
      pagamento: pedido?.pagamento || null,
    });
    setProximo("endereco");
    setVoltaInicio(false);
  };

  return (
    <div className="flex flex-col h-full content-between">
      {carrinho?.length === 0 ? (
        <>
          <div className="flex justify-center mt-28">
            <LuShoppingCart className="h-32 w-32" />
          </div>
          <p className="text-center text-gray-500 text-xl mt-8">
            Seu Carrinho está vazio
          </p>
        </>
      ) : (
        <>
          <div className="overflow-auto h-[500px]">
            {carrinho?.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => atualizaQuantidade(item, 1)}
                onDecrease={() => atualizaQuantidade(item, -1)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
          <div className="mt-auto">
            <div className="flex justify-between items-center pt-4 font-semibold">
              <span>Total:</span>
              <span>${custoTotal.toFixed(2)}</span>
            </div>
            <Button onClick={() => finalizaCarrinho()} className="w-full">
              Finalizar Pedido
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
