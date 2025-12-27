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

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";

export default function Home() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Blogs
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and trends from our team.
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUI />}>
        <LoadBlogListHome />
      </Suspense>
    </div>
  );
}

async function LoadBlogListHome() {
  // "use cache";
  // cacheLife("hours");
  // cacheTag("blog");
 await connection()
  const data = await fetchQuery(api.posts.getPosts);


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0 hover:scale-105 transition-transform duration-300">
          <CardHeader className="p-0">
            <div className="relative h-58 w-full overflow-hidden">
              <Image
                src={
                  post.imageUrl ??
                  "https://cdn.pixabay.com/photo/2015/09/18/15/48/woman-945822_1280.jpg"
                }
                alt="Image blog"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex justify-between text-muted-foreground mb-4">
              <p>{new Date(post._creationTime).toLocaleDateString()}</p>
              <p>{post.authorName}</p>
            </div>
            <Link href={`blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>
          <CardFooter className="">
            <Link
              className={buttonVariants({ className: "w-full" })}
              href={`blog/${post._id}`}
            >
              Read More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUI() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
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
