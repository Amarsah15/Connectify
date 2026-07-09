import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostsStore } from "../../store/postsStore";
import { useAuthStore } from "../../store/authStore";
import { createPostSchema } from "../../schemas/postSchemas";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const CreatePost = ({ onPostCreated }) => {
  const { authUser } = useAuthStore();
  const { createPost, isCreatingPost } = usePostsStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
  });

  const content = watch("content", "");

  const onSubmit = async (data) => {
    try {
      await createPost(data);
      reset();
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.log("Failed to create post:", error);
    }
  };

  return (
    <Card className="mb-6">
      <div className="flex gap-3">
        <Avatar
          src={authUser?.profilePicture}
          name={authUser?.name || "User"}
          size="md"
          className="hidden sm:block shrink-0 mt-0.5"
        />

        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              {...register("content")}
              placeholder="What's on your mind?"
              rows={3}
              error={errors.content?.message}
              className="min-h-[100px]"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-[var(--text-faint)]">
                {content.length}/2500
              </span>
              <Button
                type="submit"
                size="sm"
                loading={isCreatingPost}
                disabled={content.length < 10}
              >
                Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default CreatePost;