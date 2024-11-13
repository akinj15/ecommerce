"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import semImagem from "../public/imagens/semImagem.png";
import { LuShoppingCart, LuPlus, LuMinus } from "react-icons/lu";
import { Produto } from "@/types/produtos";
import { setClienteById } from "@/lib/firebase/querys/setUSer";
import { useApplication } from "./applicationProvider";
import { useState } from "react";
import { db } from "@/lib/firebase/instances";

export default function ProdutoModal({
  children,
  produto
}: Readonly<{
  children: React.ReactNode;
  produto: Produto
}>) {
  const { user, carrinho, runQuery } = useApplication();
  const [open, setOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  
  const handleAddToCart = () => {
    const novoCarrinho = carrinho || [];
    novoCarrinho.push({
      chave: produto.chave,
      imgUrl: produto.imgUrl,
      nome: produto.nome,
      quantidade: quantidade,
      // cor: produto.cor,
      // tamanho: produto.tamanho,
    });
    setClienteById(
      db,
      user?.id || "",
      { ...user, carrinho: novoCarrinho },
      setOpen
    ).then(() => runQuery());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{produto.codigo}</DialogTitle>
          <DialogDescription>Product Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 md:grid-cols-2">
          <div className="space-y-4">
            <Image
              src={produto.imgUrl.replace("http://", "https://") || semImagem}
              alt={produto.nome}
              width={200}
              height={200}
              className="w-full h-auto object-cover rounded-lg"
            />
            <p className="text-xl font-bold">${produto.preco.toFixed(2)}</p>
          </div>
          <div className="space-y-4 h-full flex flex-col content-between">
            <div className="w-full">
              <p className="text-sm text-muted-foreground">{produto.nome}</p>
              {/* <div className="space-y-2">
                <label htmlFor="size-select" className="text-sm font-medium">
                  Size
                </label>
                <Select onValueChange={setSelectedSize}>
                  <SelectTrigger id="size-select">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {produto.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="color-select" className="text-sm font-medium">
                  Color
                </label>
                <Select onValueChange={setSelectedColor}>
                  <SelectTrigger id="color-select">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {produto.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </div>
            <div className="w-full h-full flex space-x-2 items-end ">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setQuantidade(quantidade - 1 < 0 ? 0 : quantidade - 1)
                }
              >
                <LuMinus className="w-4 h-4" />
              </Button>
              <div className="flex font-semibold ">
                <span>{quantidade}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantidade(quantidade + 1)}
              >
                <LuPlus className="w-4 h-4" />
              </Button>
              <Button className="flex-1" onClick={() => handleAddToCart()}>
                <LuShoppingCart className="w-4 h-4 mr-2" />
                adicionar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
