"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowNarrowRight,
  IconLockPassword,
  IconMail,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { toast } from "@acme/ui/toast";

import { authClient } from "~/auth/client";
import { FormTextInput } from "./inputs/TextInput";

// Define the form schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const handleSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email(
        { ...data, callbackURL: "/" },
        {
          onSuccess: () => {
            toast.success("Úspešne prihlásený!");
          },
          onError: () => {
            toast.error(
              "Prihlásenie zlyhalo. Skontrolujte údaje a skúste to znova.",
            );
          },
        },
      );
    } catch (error) {
      toast.error("Prihlásenie zlyhalo. Skontrolujte údaje a skúste to znova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full space-y-4 md:w-[354px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <h3>Prihlasenie</h3>
          <div className="flex gap-4">
            <FormTextInput
              id="email"
              placeholder="Emailová adresa"
              icon={IconMail}
              iconClassName="text-white"
            />
            <FormTextInput
              id="password"
              placeholder="•••••••••••"
              icon={IconLockPassword}
              iconClassName="text-white"
              type="password"
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <Button
              type="button"
              variant="link"
              size="sm"
              className="flex text-white md:hidden"
              onClick={() => {
                router.push("/registracia");
              }}
            >
              Vytvoriť účet
            </Button>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Prihlasovanie..." : "Prihlásiť sa"}
            <IconArrowNarrowRight stroke={1} />
          </Button>
        </form>
      </Form>
    </div>
  );
};
