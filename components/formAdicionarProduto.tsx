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
import { LuShoppingCart, LuHeart } from "react-icons/lu";
import { Produto } from "@/types/produtos";

export default function ProdutoModal({
  children,
  produto
}: Readonly<{
  children: React.ReactNode;
  produto: Produto
}>) {
  // const [selectedSize, setSelectedSize] = useState<string>("");
  // const [selectedColor, setSelectedColor] = useState<string>("");

  // const handleAddToCart = () => {
  //   if (!selectedSize || !selectedColor) {
  //     alert("Please select both size and color before adding to cart.");
  //     return;
  //   }
  //   console.log(
  //     `Added ${produto.name} (Size: ${selectedSize}, Color: ${selectedColor}) to cart`
  //   );
  //   // Here you would typically dispatch an action to add the product to the cart
  // };

  return (
    <Dialog>
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
              <Button className="flex-1">
                <LuShoppingCart className="w-4 h-4 mr-2" />
                adicionar
              </Button>
              <Button variant="outline" size="icon">
                <LuHeart className="w-4 h-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
