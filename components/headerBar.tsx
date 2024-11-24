'use client'
import { LuBox, LuShoppingBag, LuShoppingCart, LuUser } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/formUser";
import { useApplication } from "@/components/applicationProvider";
import Checkout from "./checkout";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const HeaderBar = () => {
  const router = useRouter();
  const { carrinho } = useApplication();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mx-2">
          <div className="flex items-center space-x-4">
            <Link href={"/"}>
              <LuBox className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end mx-2">
          <Button
            variant={"ghost"}
            className="relative "
            onClick={() => router.push("/pedido")}
          >
            <LuShoppingBag />
          </Button>
          <Checkout>
            <Button variant={"ghost"} className="relative ">
              <LuShoppingCart />
              {carrinho && carrinho.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm font-bold text-secondary bg-destructive rounded-full -mt-1 -mr-1">
                  {carrinho.length}
                </span>
              )}
            </Button>
          </Checkout>
          <ProfileForm>
            <Button variant={"ghost"}>
              <LuUser />
            </Button>
          </ProfileForm>
        </div>
      </div>
    </header>
  );
};
