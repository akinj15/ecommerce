// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useEffect, useState } from "react";
// import { formatCep } from "@/lib/format";
// import { setEndereco } from "@/lib/firebase/querys/setEndereco";
// import { db } from "@/lib/firebase/instances";
// import { useAuth } from "./authProvider";
// import { Endereco } from "@/types/endereco";
// import { useToast } from "@/hooks/use-toast";

// const formSchema = z.object({
//   rua: z.string(),
//   cep: z.string(),
//   numero: z.string(),
//   bairro: z.string(),
//   cidade: z.string(),
//   estado: z.string(),
//   complemento: z.string(),
// });

// export function FormEndereco({
//   children,
//   dados,
// }: Readonly<{
//   children: React.ReactNode;
//   dados?: Endereco;
// }>) {
//   const id = dados?.id || "";
//   const [open, setOpen] = useState(false);

//   const { toast } = useToast();
//   const { user } = useAuth();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       rua: "",
//       cep: "",
//       numero: "",
//       bairro: "",
//       cidade: "",
//       estado: "",
//       complemento: "",
//     },
//     values: dados
//   });
//   const wCEP = form.watch("cep");

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       setEndereco(db, user?.uid || "", id, values);
//       form.reset();
//       toast({
//         title: "Sucesso"
//       });
//       setOpen(false)
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (e) {
//       toast({
//         title: "Erro"
//       });
//     }
//   }

//   useEffect(() => {
//     form.setValue("cep", formatCep(form.getValues("cep")));
//   }, [form, wCEP]);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Endereço</DialogTitle>
//           <DialogDescription>
//             Cadastre ou atualize o seu endereço para entregas.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             id={"criaEndereco"}
//             onSubmit={form.handleSubmit(onSubmit)}
//             className=""
//           >
//             <div className="flex space-x-2.5">
//               <FormField
//                 control={form.control}
//                 name="rua"
//                 render={({ field }) => (
//                   <FormItem className="w-3/4">
//                     <FormLabel>Rua*</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Rua ..." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="numero"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel>Nº*</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Nº" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <FormField
//               control={form.control}
//               name="cep"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Cep*</FormLabel>
//                   <FormControl>
//                     <Input placeholder="00000-000" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="bairro"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Bairro*</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Bairro" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="cidade"
//               render={({ field }) => (
//                 <FormItem className="space-y-0">
//                   <FormLabel>Cidade</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Cidade" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="estado"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Estado</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Estado" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="complemento"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Complemento</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Complemento" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button form={"criaEndereco"} type="submit">
//             salvar
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
