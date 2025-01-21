"use client";

import { useQuery } from "@tanstack/react-query";
import { Produto } from "@/types/produtos";
import { getClassesRecursos } from "@/lib/firebase/querys/getClasseProdutos";
import { getProdutos } from "@/lib/firebase/querys/getProdutos";
import { useEffect, useRef, useState, useTransition } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import semImagem from "../../public/imagens/sem_foto.png";
import { Label } from "../ui/label";
import ProdutoModal from "../form/formAdicionarProduto";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Loading } from "@/components/Loading";

export function ListaProdutos() {
  const [classe, setClasse] = useState("");
  const [ultimaChave, setUltimaChave] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>();
  const [ultimo, setUltimo] = useState(false);
  const observerTarget = useRef(null);
  const [isPending, startTransition] = useTransition();

  const query = useQuery({
    queryKey: ["getClassesRecursos"],
    queryFn: getClassesRecursos,
  });
  const classes = query.data;

  const handlerClasse = (classe: string) => {
    setUltimaChave(null);
    setUltimo(false);
    setClasse(classe);
  };

  const getFirstProdutos = async () => {
    startTransition(async () => {
      const res = await getProdutos({
        classe: classe,
        lastVisible: ultimaChave,
        limit: 100,
      });
        setProdutos(res.produtos);
        setUltimaChave(res.pageParams.lastVisible);
        setUltimo(res.pageParams.ultimo);
      
    });
  };

  
  const getNextProdutos = async () => {
    startTransition(async () => {
      const res = await getProdutos({ classe: classe, lastVisible: ultimaChave, limit: 100 });
      let prod = produtos || [];
      prod = prod.concat(res.produtos);
      setProdutos(prod);
      setUltimaChave(res.pageParams.lastVisible);
      setUltimo(res.pageParams.ultimo);
    });
  };

  useEffect(() => {
    getFirstProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classe]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!isPending && ultimaChave && !ultimo) {
            getNextProdutos();
          }
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerTarget.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerTarget, classe, ultimaChave, isPending]);

  return (
    <div className="">
      <div className="mb-6">
        <div>
          <Label>Categorias</Label>

          <ScrollArea className=" whitespace-nowrap ">
            <div className="flex w-max space-x-4 py-4">
              <Badge onClick={() => handlerClasse("")}>todos</Badge>
              {classes?.map((classe) => (
                <Badge
                  key={classe.id}
                  onClick={() => handlerClasse(classe.nome)}
                >
                  {classe.nome}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:lg:grid-cols-6 gap-4 my-4">
          {produtos?.map((product) => (
            <>
              <ProdutoModal key={product.id} produto={product}>
                <Card
                  key={product.id + "card"}
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
                    <p className="font-bold">${product.preco.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </ProdutoModal>
            </>
          ))}
        </div>
        {isPending && (
          <div className="h-20 mb-16">
            <Loading />
          </div>
        )}
        <div ref={observerTarget}></div>
      </div>
    </div>
  );
}
