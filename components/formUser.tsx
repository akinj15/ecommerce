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
import { formatCpfCnpj, formatNumber } from "@/lib/format";
import { db } from "@/lib/firebase/instances";
import { setClienteById } from "@/lib/firebase/querys/setUSer";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApplication } from "./applicationProvider";
import { useToast } from "@/hooks/use-toast";
import { FormEndereco } from "./formEndereco";
import { LuMoreVertical, LuUser } from "react-icons/lu";

const formSchema = z.object({
  nome: z.string(),
  cpf: z.string(),
  telefone: z.string(),
});

export function ProfileForm({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const { user, endereco, runQuery } = useApplication();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      telefone: "",
    },
    values: {
      nome: user?.nome || "",
      cpf: user?.cpf || "",
      telefone: user?.telefone || "",
    },
  });

  const wCPF = form.watch("cpf");
  const wTelefone = form.watch("telefone");

  function onSubmitCliente(values: z.infer<typeof formSchema>) {
    try {
      setClienteById(db, user?.id || "", values, setOpen);
      toast({
        title: "Sucesso",
      });
      runQuery();
    } catch (e) {
      console.log(e);
      toast({
        title: "Falha ao salvar",
      });
    }
  }

  useEffect(() => {
    form.setValue("cpf", formatCpfCnpj(form.getValues("cpf")));
  }, [form, wCPF]);

  useEffect(() => {
    form.setValue("telefone", formatNumber(form.getValues("telefone")));
  }, [form, wTelefone]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-center mt-2">
          <LuUser className="h-16 w-16" />
        </div>
        <Form {...form}>
          <form
            id="formUser"
            onSubmit={form.handleSubmit(onSubmitCliente)}
            className="space-y-8"
          >
            <div className="">
              <div>
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(99) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        {endereco?.length ? (
          <>
            <FormEndereco dados={endereco[0]}>
              <div className="flex items-center justify-between my-4">
                <div className="">
                  <h3 className="font-semibold">
                    {endereco[0].rua + " - " + endereco[0].numero}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {`${endereco[0].bairro} - ${endereco[0].cidade}`}
                  </p>
                </div>
                <div>
                  <LuMoreVertical />
                </div>
              </div>
            </FormEndereco>
          </>
        ) : (
          <>
            <FormEndereco>
              <Button className="w-full">Cadastre um novo endereço</Button>
            </FormEndereco>
          </>
        )}

        <DialogFooter>
          <Button form="formUser" type="submit">
            salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
