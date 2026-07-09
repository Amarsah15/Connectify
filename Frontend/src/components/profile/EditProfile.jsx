import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import { updateProfileSchema } from "../../schemas/profileSchemas";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const EditProfile = ({ profile, onProfileUpdated, onCancel }) => {
  const { authUser } = useAuthStore();
  const {
    profile: storeProfile,
    updateProfile,
    isUpdatingProfile,
  } = useProfileStore();

  const initial = profile || storeProfile || authUser;

  const [avatarPreview, setAvatarPreview] = useState(initial?.profilePicture || "");
  const [avatarBase64, setAvatarBase64] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initial?.name ?? "",
      username: initial?.username ?? "",
      headline: initial?.headline ?? "",
      bio: initial?.bio ?? "",
    },
  });

  const headline = watch("headline", "");
  const bio = watch("bio", "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatarBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (avatarBase64) {
        payload.profilePicture = avatarBase64;
      }
      const updatedUser = await updateProfile(payload);
      if (onProfileUpdated) onProfileUpdated(updatedUser);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Avatar Upload Selection */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 mb-4 pb-4 border-b border-[var(--border-light)]">
          <div className="relative shrink-0">
            <img
              src={avatarPreview || `https://api.dicebear.com/5.x/initials/svg?seed=${initial?.name || "User"}`}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-[var(--border)] bg-[var(--surface-2)]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold
                bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface-3)]
                border border-[var(--border)] transition-colors cursor-pointer"
            >
              Upload Photo
            </label>
            <p className="text-xs text-[var(--text-faint)] mt-1.5">
              JPG, PNG or WEBP. Max size 5MB.
            </p>
          </div>
        </div>

        <Input
          {...register("name")}
          type="text"
          label="Full name"
          placeholder="Enter your full name"
          error={errors.name?.message}
        />

        <Input
          {...register("username")}
          type="text"
          label="Username"
          placeholder="johndoe"
          error={errors.username?.message}
        />

        <div className="space-y-1">
          <Input
            {...register("headline")}
            type="text"
            label="Headline"
            placeholder="e.g. Full Stack Dev | Product Designer"
            error={errors.headline?.message}
          />
          <div className="text-xs text-[var(--text-faint)] text-right">
            {headline.length}/60 characters
          </div>
        </div>

        <div>
          <Textarea
            {...register("bio")}
            label="Bio"
            rows={3}
            placeholder="Tell us about yourself..."
            error={errors.bio?.message}
          />
          <div className="text-sm text-[var(--text-faint)] mt-1">
            {bio.length}/160 characters
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={isUpdatingProfile}>
            Save changes
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditProfile;
