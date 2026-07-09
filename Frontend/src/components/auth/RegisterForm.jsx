import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/authStore";
import { registerSchema } from "../../schemas/authSchemas";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Logo from "../common/Logo";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate("/feed");
    } catch (error) {
      console.log("Signup failed:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[var(--bg)] relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Column (Left Side) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-8 bg-gradient-to-b from-[var(--surface)] to-[var(--bg)] border-r border-[var(--border-light)] relative z-10">
        {/* Vertically centered layout group to prevent scroll and cutoff */}
        <div className="max-w-md mx-auto my-auto flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Logo height={44} />
          </div>

          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
              Start Your Journey.
              <span className="block mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">
                Join the Network.
              </span>
            </h2>
            <p className="mt-3 text-base text-[var(--text-muted)] leading-relaxed">
              Create an account to connect with peers, post highlights, follow professionals, and explore communities managed by verified moderators.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-light)] backdrop-blur-sm">
            <p className="text-sm italic text-[var(--text-muted)]">
              "Connecting with other developers here was seamless. I love the clean design, lightning fast navigation, and moderation structure."
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                ⚡ Connectify community member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Column (Right Side) */}
      <div className="flex-1 flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center lg:text-left mb-4">
            <div className="flex justify-center lg:justify-start mb-4 lg:hidden">
              <Logo height={40} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
              Create account
            </h1>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors underline decoration-2 decoration-brand-500/20 hover:decoration-brand-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="bg-[var(--surface)]/80 backdrop-blur-sm border border-[var(--border-light)] rounded-2xl shadow-xl p-5 sm:p-6">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register("name")}
                type="text"
                label="Full name"
                placeholder="John Doe"
                error={errors.name?.message}
                className="rounded-xl border-[var(--border)] focus:ring-brand-500 py-2 text-base"
              />

              <Input
                {...register("username")}
                type="text"
                label="Username"
                placeholder="johndoe"
                onKeyDown={handleUsernameKeyDown}
                error={errors.username?.message}
                className="rounded-xl border-[var(--border)] focus:ring-brand-500 py-2 text-base"
              />

              <Input
                {...register("email")}
                type="email"
                label="Email address"
                placeholder="you@example.com"
                error={errors.email?.message}
                className="rounded-xl border-[var(--border)] focus:ring-brand-500 py-2 text-base"
              />

              <Input
                {...register("password")}
                type="password"
                label="Password"
                placeholder="Min. 6 characters"
                error={errors.password?.message}
                className="rounded-xl border-[var(--border)] focus:ring-brand-500 py-2 text-base"
              />

              <Button
                type="submit"
                fullWidth
                loading={isSigningUp}
                className="rounded-xl py-2.5 font-semibold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer shadow-lg shadow-brand-500/10 mt-2 text-base"
              >
                Create account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
