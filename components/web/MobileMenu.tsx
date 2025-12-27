"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const MobileMenu = () => {
   const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="sr-only">Навігаційне меню</SheetTitle>
          <SheetDescription className="sr-only">Використовуйте це меню для переходу між сторінками блогу</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 pt-20">
          <Link onClick={() => setOpen(false)} className={buttonVariants({ variant: "ghost" })} href="/">
            Home
          </Link>
          <Link onClick={() => setOpen(false)} className={buttonVariants({ variant: "ghost" })} href="/blog">
            Blog
          </Link>
          <Link onClick={() => setOpen(false)} className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
