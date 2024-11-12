"use client";

import { useQuery } from "@/lib/firebase/firebaseQuery";
import { db } from "@/lib/firebase/instances";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassesProdutos, Produto } from "@/types/produtos";
import { getClassesRecursos } from "@/lib/firebase/querys/getClasseProdutos";
import { getProdutos } from "@/lib/firebase/querys/getProdutos";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "./ui/card";
import Image from "next/image";
import semImagem from "../public/imagens/semImagem.png";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import ProdutoModal from "./formAdicionarProduto";

export function ListaProdutos() {
  const [classe, setClasse] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>();
  const { data: classes } = useQuery<ClassesProdutos[]>(() =>
    getClassesRecursos(db)
  );

  useEffect(() => {
    getProdutos(db, {
      limit: 24,
      classe: classe,
      orderBy: "classe",
    }).then((data) => setProdutos(data));
  }, [classe]);

  console.log(produtos);
  return (
    <div className="">
      <div className="mb-6">
        <div className="">
          <Label htmlFor="picture">Pesquisa</Label>
          <Input />
        </div>
        <div>
          <Label>Categoria</Label>
          <Select onValueChange={(e) => setClasse(e)}>
            <SelectTrigger className="">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((classe) => {
                return (
                  <SelectItem key={classe.id} value={classe.nome}>
                    {classe.nome}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {produtos?.map((product) => (
              <ProdutoModal key={product.chave} produto={product}>
                <Card key={product.chave} className="overflow-hidden">
                  <div className="flex md:flex-row">
                    <CardContent className="flex-grow p-6 w-2/3 h-full">
                      <h3 className="text-sm font-semibold mb-2">
                        {product.codigo}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {product.nome}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          ${product.preco.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                    <div className="w-1/3 relative">
                      <Image
                        src={
                          product.imgUrl.replace("http://", "https://") ||
                          semImagem
                        }
                        width={200}
                        height={200}
                        alt={product.nome}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  </div>
                </Card>
              </ProdutoModal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
