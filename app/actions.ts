"use server";
import { fetchMutation } from "convex/nextjs";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";
import { Id } from "@/convex/_generated/dataModel";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Something went wrong");
    }

    const token = await getToken();

    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return { error: "Failed to upload image" };
    }

    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch {
    return { error: "Failed to create post" };
  }

  updateTag("blog");
  return redirect("/blog");
}

export async function deleteBlogAction(postId: Id<"posts">) {
  try {
    const token = await getToken();
    if (!token) return { error: "Немає доступу" };
    await fetchMutation(api.posts.deleteMyPost, { postId: postId }, { token });
  } catch {
    return { error: "Failed to delete post" };
  }

  updateTag("blog");
  return redirect("/blog");
}
