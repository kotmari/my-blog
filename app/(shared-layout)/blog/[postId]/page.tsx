import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import PostPresence from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
  };
}

export default async function PoastIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;
  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId: postId }),
    await preloadQuery(api.comments.getCommentsByPostId, { postId: postId }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);


  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-semibold text-red-600">No post found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({
          variant: "outline",
          className: "mb-6 pt-2.5",
        })}
        href="/"
      >
        <ArrowLeft size={16} /> <span>Back to blog</span>
      </Link>
      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://cdn.pixabay.com/photo/2015/09/18/15/48/woman-945822_1280.jpg"
          }
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Posted on: {new Date(post._creationTime).toLocaleString()}
            </p>
            {userId && <PostPresence roomId={post._id} userId={userId} />}
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            author: {post.authorName ?? "Anonymous"}
          </p>
        </div>
      </div>

      <Separator className="my-8" />
      <p className="text-lg leading-relaxed text-foreground/90">{post.body}</p>
      <Separator className="my-8" />
      <CommentSection preloadedComments={preloadedComments} userId={userId} />
    </div>
  );
}
