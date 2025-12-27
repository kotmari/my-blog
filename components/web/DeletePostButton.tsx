"use client"

import { deleteBlogAction } from "@/app/actions";
import { Id } from "@/convex/_generated/dataModel";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function DeletePostButton({ postId }: { postId: Id<"posts"> }) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteMyPost = () => {
   console.log("clik")
    startTransition(async () => {
     const result = await deleteBlogAction(postId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Пост видалено");
      }
    });
  };

  return (
    <Button variant="outline" size="lg" onClick={handleDeleteMyPost}>
      {isPending ? "Deleted..." : "Delete"}
    </Button>
  );
}
