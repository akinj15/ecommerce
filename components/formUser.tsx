"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { formatCpfCnpj, formatNumber } from "@/lib/format";
import { getClienteById } from "@/lib/firebase/querys/getUser";
import { db } from "@/lib/firebase/instances";
import { useQuery } from "@/lib/firebase/firebaseQuery";
import { Loading } from "./loading";
import { setClienteById } from "@/lib/firebase/querys/setUSer";

const formSchema = z.object({
  nome: z.string(),
  cpf: z.string(),
  telefone: z.string(),
});

export function ProfileForm({ id } : { id: string}) {
  const { data, loading } = useQuery<
    z.infer<typeof formSchema>,
    { id: string }
  >(getClienteById, db, { id });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      telefone: "",
    },
    values: data,
  });

  const wTelefone = form.watch("telefone");
  const wCPF = form.watch("cpf");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setClienteById(db, id, values);
  }

  useEffect(() => {
    form.setValue("telefone", formatNumber(form.getValues("telefone")));
  }, [form, wTelefone]);

  useEffect(() => {
    form.setValue("cpf", formatCpfCnpj(form.getValues("cpf")));
  }, [form, wCPF]);

  if (loading) {
    return <Loading />
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">salvar</Button>
      </form>
    </Form>
  );
}
