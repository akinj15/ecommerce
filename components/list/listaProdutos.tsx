"use client";

import { useQuery } from "@tanstack/react-query";
import { Produto } from "@/types/produtos";
import { getClassesRecursos } from "@/lib/firebase/querys/getClasseProdutos";
import { getProdutos } from "@/lib/firebase/querys/getProdutos";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import semImagem from "../../public/imagens/sem_foto.png";
import { Label } from "../ui/label";
import ProdutoModal from "../form/formAdicionarProduto";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ListaProdutos() {
  const [classe, setClasse] = useState("");
  const [produtos, setProdutos] = useState<Produto[][]>();

  const query = useQuery({
    queryKey: ["getPedidos"],
    queryFn: getClassesRecursos,
  });
  const classes = query.data;

  useEffect(() => {
    getProdutos({
      limit: 24,
      classe: classe,
      orderBy: "classe",
    }).then((data) => {
      const retorno: Produto[][] = [];
      const aux: Record<string, Produto[]> = {};
      
      data?.map((produto) => { 
        if (!aux[produto.classe]) {
          aux[produto.classe] = [produto];
        } else {
          aux[produto.classe].push(produto);
        }
      });

      for (const key in aux) {
        retorno.push(aux[key]);
      }
      setProdutos(retorno);

    });
  }, [classe]);

  return (
    <div className="">
      <div className="mb-6">
        {/* <div className="">
          <Label htmlFor="picture">Pesquisa</Label>
          <Input />
        </div> */}
        <div>
          {/* <Select onValueChange={(e) => setClasse(e)}>
            <SelectTrigger className="">
              <SelectValue placeholder="Todos" />
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
          </Select> */}
          <Label>Categorias</Label>

          <ScrollArea className=" whitespace-nowrap ">
            <div className="flex w-max space-x-4 py-4">
              <Badge onClick={() => setClasse("")}>
                todos
              </Badge>
              {classes?.map((classe) => (
                <Badge key={classe.id} onClick={() => setClasse(classe.nome)}>
                  {classe.nome}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div>
        <div className="">
          {produtos?.map((item) => (
            <>
              <div key={item[0].classe + item.length}>
                <Label className="text-2xl">{item[0].classe}</Label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:lg:grid-cols-6 gap-4 my-4">
                  {item?.map((product) => (
                    <>
                      <ProdutoModal key={product.chave} produto={product}>
                        <Card
                          key={product.chave}
                          className="cursor-pointer hover:shadow-xl transition ease-in-out delay-150"
                        >
                          <CardContent className="p-4">
                            <Image
                              src={
                                product.imgUrl.replace("http://", "https://") ||
                                semImagem
                              }
                              alt={product.nome}
                              width={200}
                              height={200}
                              className="w-full h-50 object-cover mb-2"
                            />
                            <h3 className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                              {product.codigo}
                            </h3>
                            <p className="font-bold">
                              ${product.preco.toFixed(2)}
                            </p>
                          </CardContent>
                        </Card>
                      </ProdutoModal>
                    </>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

// <Card key={product.chave} className="overflow-hidden">
//   <div className="flex md:flex-row">
//     <CardContent className="flex-grow p-6 w-2/3 h-full">
//       <h3 className="text-sm font-semibold mb-2">
//         {product.codigo}
//       </h3>
//       <p className="text-muted-foreground text-sm mb-4">
//         {product.nome}
//       </p>
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-bold">
//           ${product.preco.toFixed(2)}
//         </span>
//       </div>
//     </CardContent>
//     <div className="w-1/3 relative">
//       <Image
//         src={
//           product.imgUrl.replace("http://", "https://") ||
//           semImagem
//         }
//         width={200}
//         height={200}
//         alt={product.nome}
//         className="w-full h-48 object-cover rounded-md"
//       />
//     </div>
//   </div>
// </Card>;
