"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,

} from "@/components/ui/dialog";
import { useRouter } from "next/router";  


export function ModalPedido({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handlerOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen open onOpenChange={handlerOpenChange}>
      <DialogOverlay>
        <DialogContent
          className="sm:max-w-[425px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {children}
          <DialogFooter>
            <Button form="formUser" type="submit" className="w-full">
              salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
