"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "auth-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, Form as RouterForm } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Spin from "~/components/ui/spin";
import { cn } from "~/lib/utils";

const formSchema = z.object({
  email: z.string().email("Please use the validate email!"),
  password: z.string().min(8).max(50),
});

export function LoginForm({ className }: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
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
        },
        onError: (ctx) => {
          console.log(ctx.error);
          // Handle the error

          toast.error(ctx.error.message);
        },
      }
    );
  }
  return (
    <Form {...form}>
      <RouterForm
        id="my-form"
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...field}
                />
              </div>
            )}
          />
          <div className="grid gap-3">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <>
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required {...field} />
                </>
              )}
            />
          </div>
          <Button type="submit" className="w-full" form="my-form">
            Login {loading && <Spin />}
          </Button>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account? <NavLink to="/sign-up">sign up</NavLink>
        </div>
      </RouterForm>
    </Form>
  );
}
