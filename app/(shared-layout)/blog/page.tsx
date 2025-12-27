
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense} from "react";
import { getToken } from "@/lib/auth-server";
import { cookies } from "next/headers";
import { Separator } from "@/components/ui/separator";
import DeletePostButton from "@/components/web/DeletePostButton";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My posting list",
    description: "bla bla bla bla bla",
  };
}



export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and trends from our team.
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUI />}>
        <LoadMyBlogList />
      </Suspense>
    </div>
  );
}

async function LoadMyBlogList() {

  await cookies()

  const token = await getToken();
  const data = await fetchQuery(api.posts.getMyPosts, {}, {token});




  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">У вас ще немає жодного поста.</p>
        <Link href="/create" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
          Створити перший пост
        </Link>
      </div>
    );
  }

  return (

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={post.imageUrl ?? "https://cdn.pixabay.com/photo/2015/09/18/15/48/woman-945822_1280.jpg"}
                alt="Image blog"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <Link href={`blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6">
            <Link
              className={buttonVariants({ className: "w-full" })}
              href={`blog/${post._id}`}
            >
              Read More
            </Link>
            <Separator />
            <DeletePostButton postId={post._id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUI() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {
        [...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-2 flex flex-col">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
    </div>
  );
}
