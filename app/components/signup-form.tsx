"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { authClient } from "auth-client";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { redirect, Form as RouterForm } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { StarsBackground } from "~/components/animate-ui/backgrounds/stars";
import { Button } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Spin from "~/components/ui/spin";
import { generateRandomString } from "~/lib/strings";
import { cn } from "~/lib/utils";

export default function SignupForm() {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
    name: z.string().min(1).max(50),
  });
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("sign up");
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${generateRandomString(
          5
        )}`,
        callbackURL: "/dashboard",
      },

      {
        onRequest: (ctx) => {
          // show loading state
          console.log("loading...");
          setLoading(true);
        },
        onSuccess: (ctx) => {
          // redirect to home
          console.log("success");
          setLoading(false);
          redirect("/login");
        },
        onError: (ctx) => {
          console.log(ctx.error);
          toast.error("ERROR" + ctx.error.message);
          setLoading(false);
        },
      }
    );
  }

  return (
    <StarsBackground className="w-screen h-screen flex items-center justify-center overflow-hidden">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Login if you can because we don&apos;t have a login flow yet
        </p>
        <Form {...form}>
          <RouterForm className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <LabelInputContainer>
                    <Label htmlFor="name">name</Label>
                    <Input
                      id="name"
                      placeholder="Tyler"
                      type="text"
                      {...field}
                    />
                  </LabelInputContainer>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
                    {...field}
                  />
                </LabelInputContainer>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
                </LabelInputContainer>
              )}
            />
            <Button
              className="flex items-center justify-center w-full"
              type="submit"
              disabled={loading}
            >
              Sign up {loading ? <Spin /> : <ArrowRight />}
              <BottomGradient />
            </Button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex flex-col space-y-4">
              <button
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                type="submit"
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  GitHub
                </span>
                <BottomGradient />
              </button>
              <button
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                type="submit"
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Google
                </span>
                <BottomGradient />
              </button>
            </div>
          </RouterForm>
        </Form>
      </div>
    </StarsBackground>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
