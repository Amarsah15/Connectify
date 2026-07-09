import React, { useState } from "react";
import { Settings, User, Lock, Moon, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { useThemeStore } from "../store/themeStore";
import { axiosInstance } from "../utils/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import toast from "react-hot-toast";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SettingsPage = () => {
  const { authUser } = useAuthStore();
  const { updateProfile, isUpdatingProfile } = useProfileStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile form
  const [profileName, setProfileName] = useState(authUser?.name || "");
  const [profileHeadline, setProfileHeadline] = useState(authUser?.headline || "");
  const [profileBio, setProfileBio] = useState(authUser?.bio || "");
  const [profileUsername, setProfileUsername] = useState(authUser?.username || "");
  const [profilePicturePreview, setProfilePicturePreview] = useState(authUser?.profilePicture || "");
  const [profilePictureBase64, setProfilePictureBase64] = useState("");

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
      setProfilePicturePreview(reader.result);
      setProfilePictureBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: profileName, bio: profileBio, username: profileUsername, headline: profileHeadline };
      if (profilePictureBase64) {
        payload.profilePicture = profilePictureBase64;
      }
      await updateProfile(payload);
    } catch {}
  };

  const handleUsernameKeyDown = (e) => {
    const allowedKeys = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
      "Tab", "Enter", "Shift", "Control", "Alt", "Meta", "CapsLock"
    ];
    if (allowedKeys.includes(e.key)) return;
    if (!/^[a-zA-Z0-9_]$/.test(e.key)) {
      e.preventDefault();
      toast.error("Username only supports letters, numbers, and underscores (_).");
    }
  };

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordUpdate = async (data) => {
    setIsChangingPassword(true);
    try {
      const res = await axiosInstance.put("/profile/update-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(res.data.message);
      resetPasswordForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Moon },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
          <Settings size={22} className="text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Settings</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Manage your account preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[var(--surface-2)] rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all cursor-pointer
              ${
                activeTab === tab.id
                  ? "bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-light)]">
            <Avatar
              src={profilePicturePreview}
              name={authUser?.name || "User"}
              size="lg"
            />
            <div>
              <h3 className="font-semibold text-[var(--text)]">
                {authUser?.name}
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="settings-avatar-upload"
              />
              <label
                htmlFor="settings-avatar-upload"
                className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl text-xs font-semibold
                  bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface-3)]
                  border border-[var(--border)] transition-colors cursor-pointer mt-2"
              >
                Change Photo
              </label>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Display name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]
                  text-[var(--text)] placeholder-[var(--text-faint)]
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-all text-sm"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={profileUsername}
                onChange={(e) => setProfileUsername(e.target.value.toLowerCase())}
                onKeyDown={handleUsernameKeyDown}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]
                  text-[var(--text)] placeholder-[var(--text-faint)]
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-all text-sm"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={profileHeadline}
                onChange={(e) => setProfileHeadline(e.target.value)}
                maxLength={60}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]
                  text-[var(--text)] placeholder-[var(--text-faint)]
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-all text-sm"
                placeholder="e.g. Full Stack Dev | Product Designer"
              />
              <span className="text-xs text-[var(--text-faint)] block mt-1">
                {profileHeadline.length}/60
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Bio
              </label>
              <textarea
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                rows={3}
                maxLength={160}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]
                  text-[var(--text)] placeholder-[var(--text-faint)]
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-all text-sm resize-none"
                placeholder="Tell us about yourself..."
              />
              <span className="text-xs text-[var(--text-faint)]">
                {profileBio.length}/160
              </span>
            </div>

            <Button type="submit" loading={isUpdatingProfile}>
              Save changes
            </Button>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Change Password
            </h2>
          </div>

          <form
            onSubmit={handlePasswordSubmit(handlePasswordUpdate)}
            className="space-y-4 max-w-sm"
          >
            <Input
              {...registerPassword("currentPassword")}
              type="password"
              label="Current password"
              placeholder="Enter current password"
              error={passwordErrors.currentPassword?.message}
            />
            <Input
              {...registerPassword("newPassword")}
              type="password"
              label="New password"
              placeholder="Min. 6 characters"
              error={passwordErrors.newPassword?.message}
            />
            <Input
              {...registerPassword("confirmPassword")}
              type="password"
              label="Confirm new password"
              placeholder="Repeat new password"
              error={passwordErrors.confirmPassword?.message}
            />
            <Button type="submit" loading={isChangingPassword}>
              Update password
            </Button>
          </form>
        </Card>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Moon size={18} className="text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Theme
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { value: "light", label: "Light", emoji: "☀️" },
              { value: "dark", label: "Dark", emoji: "🌙" },
              { value: "system", label: "System", emoji: "💻" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer
                  ${
                    theme === option.value
                      ? "border-brand-600 bg-brand-600/5 ring-2 ring-brand-600/20"
                      : "border-[var(--border)] hover:border-brand-600/30 hover:bg-[var(--surface-2)]"
                  }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span
                  className={`text-sm font-medium ${
                    theme === option.value
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
};

export default SettingsPage;
