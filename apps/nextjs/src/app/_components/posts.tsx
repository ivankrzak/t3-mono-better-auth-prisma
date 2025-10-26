"use client";

import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";

import type { RouterOutputs } from "@acme/api";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";
import { FormTextInput } from "./inputs/TextInput";

// Define the form schema
const createPostSchema = z.object({
  title: z
    .string()
    .min(2, "Názov musí mať aspoň 2 znaky")
    .max(100, "Názov musí mať menej ako 100 znakov"),
  content: z
    .string()
    .min(2, "Obsah musí mať aspoň 2 znaky")
    .max(1000, "Obsah musí mať menej ako 1000 znakov"),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<CreatePostFormData>({
    defaultValues: {
      content: "",
      title: "",
    },
    resolver: zodResolver(createPostSchema),
  });
  const { errors } = form.formState;

  const createPost = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.post.pathFilter());
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to post"
            : "Failed to create post",
        );
      },
    }),
  );

  const handleSubmit = async (data: CreatePostFormData) => {
    createPost.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3>Vytvoriť nový príspevok</h3>
        <div className="flex flex-col gap-4">
          <FormTextInput
            id="title"
            iconClassName="text-white"
            placeholder="Názov"
            isRequired
            errorMessage={errors.title?.message}
          />
          <FormTextInput
            id="content"
            iconClassName="text-white"
            placeholder="Obsah"
            isRequired
            errorMessage={errors.content?.message}
          />
        </div>
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

export function PostList() {
  const trpc = useTRPC();
  const { data: posts } = useSuspenseQuery(trpc.post.all.queryOptions());

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No posts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deletePost = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.post.pathFilter());
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete a post"
            : "Failed to delete post",
        );
      },
    }),
  );

  return (
    <div className="bg-muted flex flex-row rounded-lg p-4">
      <div className="grow">
        <h2 className="text-primary text-2xl font-bold">{props.post.title}</h2>
        <p className="mt-2 text-sm">{props.post.content}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="text-primary cursor-pointer text-sm font-bold uppercase hover:bg-transparent hover:text-white"
          onClick={() => deletePost.mutate(props.post.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="bg-muted flex flex-row rounded-lg p-4">
      <div className="grow">
        <h2
          className={cn(
            "bg-primary w-1/4 rounded-sm text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded-sm bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
