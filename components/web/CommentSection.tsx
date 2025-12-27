"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams, usePathname } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import Link from "next/link";

interface CommentSectionProps {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
  userId: string | null; // <--- 1. Додаємо сюди userId
}



export default function CommentSection({preloadedComments, userId}: CommentSectionProps) {
  const params = useParams<{ postId: Id<"posts"> }>();
  const data = usePreloadedQuery(preloadedComments); //дозволяє в реальному часі відображати додані коментарії
  const createComment = useMutation(api.comments.createComment);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to create post");
      }
    });
  }

  if (data === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare size={20} />
        <h2 className="text-xl font-bold">{data.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="rounded-full"
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className=" flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <p className=" text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
        {userId ? (
                  <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Add Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Create Comment</span>
            )}
          </Button>
        </form>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed text-center space-y-3">
            <p className="text-muted-foreground font-medium">
              Хочете поділитися думками?
            </p>
            <p className="text-sm text-muted-foreground/80 max-w-xs">
              Тільки зареєстровані користувачі можуть залишати коментарі до цього посту.
            </p>
            <Button asChild variant="default">
              <Link href={`/auth/login?returnTo=${encodeURIComponent(pathname)}`}>
                Увійти або зареєструватися
              </Link>
            </Button>
          </div>
        )}


        {data?.length > 0 && <Separator />}
      </CardContent>
    </Card>
  );
}
