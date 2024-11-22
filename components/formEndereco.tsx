"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/instances";
import { setEnderecoByIdCliente, updateEnderecoByIdCliente } from "@/lib/firebase/querys/setUSer";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApplication } from "./applicationProvider";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Endereco } from "@/types/endereco";

const formSchema = z.object({
  rua: z.string(),
  cep: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string(),
  uf: z.string(),
  complemento: z.string(),
  numero: z.string(),
});

export function FormEndereco({
  children,
  dados,
}: Readonly<{
  children: React.ReactNode;
  dados?: Endereco;
}>) {
  const [openFormEndereco, setOpenFormEndereco] = useState(false);
  const [cep, setCep] = useState("");
  const { user, runQuery, loading } = useApplication();
  const [novoEndereco, setNovoEndereco] = useState(!loading && !dados);
  const { toast } = useToast();

  const formEndereco = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rua: "",
      cep: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
    },
    values: {
      rua: dados?.rua || "",
      cep: dados?.cep || "",
      numero: dados?.numero || "",
      bairro: dados?.bairro || "",
      cidade: dados?.cidade || "",
      estado: dados?.estado || "",
      uf: dados?.uf || "",
      complemento: dados?.complemento || "",
    },
  });

  function onSubmitEndereco(values: z.infer<typeof formSchema>) {
    try {
      if (dados?.id) {
        updateEnderecoByIdCliente(db, user?.id || "", dados.id, values).then(() => {
          toast({
            title: "Sucesso",
          });
          runQuery();
          setOpenFormEndereco(false);
        });
      } else {
        setEnderecoByIdCliente(db, user?.id || "", values).then(() => {
          toast({
            title: "Sucesso",
          });
          runQuery();
          setOpenFormEndereco(false);
        });
      }

    } catch (e) {
      console.log(e);
      toast({
        title: "Falha ao salvar",
      });
    }
  }

  useEffect(() => {
    if (cep && cep.length == 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`).then((e) =>
        e.json().then((data) => {
          formEndereco.setValue("rua", data.logradouro);
          formEndereco.setValue("estado", data.estado);
          formEndereco.setValue("uf", data.uf);
          formEndereco.setValue("cidade", data.localidade);
          formEndereco.setValue("bairro", data.bairro);
          setNovoEndereco(false);
        })
      ).catch(() => {
        toast({
          title: "Digite cep novamente.",
          variant: "destructive"
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  return (
    <Dialog open={openFormEndereco} onOpenChange={setOpenFormEndereco}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Endereço</DialogTitle>
          <DialogDescription>Digite o seu cep.</DialogDescription>
        </DialogHeader>
        {novoEndereco ? ( 
          <>
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={8}
                  value={cep}
                  onChange={(value) => setCep(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </>
        ) : (
          <>
            <Form {...formEndereco}>
              <form
                id="formEndereco"
                onSubmit={formEndereco.handleSubmit(onSubmitEndereco)}
                className="space-y-8"
              >
                <div>
                  <div className="flex space-x-2.5">
                    <div className="w-3/4">
                      <FormField
                        control={formEndereco.control}
                        name="rua"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rua</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite o nome da sua rua"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={formEndereco.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nº</FormLabel>
                            <FormControl>
                              <Input placeholder="Nº" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <FormField
                      control={formEndereco.control}
                      name="bairro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={formEndereco.control}
                      name="complemento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input placeholder="Casa, Vila..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex space-x-2.5">
                    <div className="w-3/4">
                      <FormField
                        control={formEndereco.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={formEndereco.control}
                        name="uf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="Estado" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </>
        )}
        <DialogFooter>
          {novoEndereco ? (
            <></>
          ) : (
            <>
              {" "}
              <Button form="formEndereco" type="submit">
                salvar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
