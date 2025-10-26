"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowNarrowRight,
  IconLockPassword,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { toast } from "@acme/ui/toast";

import { authClient } from "~/auth/client";
import { FormTextInput } from "./inputs/TextInput";

// Define the form schema
const registrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "Meno musí mať aspoň 2 znaky")
    .max(50, "Meno musí mať menej ako 50 znakov"),
  lastName: z
    .string()
    .min(2, "Priezvisko musí mať aspoň 2 znaky")
    .max(50, "Priezvisko musí mať menej ako 50 znakov"),
  email: z.string().email("Neplatná emailová adresa"),
  password: z.string().min(8, "Heslo musí mať aspoň 8 znakov"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const { errors } = form.formState;

  const handleSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      await authClient.signUp.email(
        {
          ...data,
          name: `${data.firstName} ${data.lastName}`,
        },
        {
          onSuccess: () => {
            toast.success("Registrácia bola úspešná!");
            router.refresh();
          },
          onError: () => {
            toast.error(
              "Registrácia zlyhala. Skontrolujte údaje a skúste to znova.",
            );
          },
        },
      );
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full space-y-4 md:w-[354px]">
      {/* Registration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <h3>Registrácia</h3>
          <div className="flex gap-4">
            <FormTextInput
              id="firstName"
              icon={IconUser}
              iconClassName="text-white"
              placeholder="Meno"
              isRequired
              errorMessage={errors.firstName?.message}
            />
            <FormTextInput
              id="lastName"
              icon={IconUser}
              iconClassName="text-white"
              placeholder="Priezvisko"
              isRequired
              errorMessage={errors.lastName?.message}
            />
          </div>
          <FormTextInput
            id="email"
            icon={IconMail}
            iconClassName="text-white"
            placeholder="Emailová adresa"
            bottomLabel="Emailová adresa je zároveň prihlasovací údaj."
            isRequired
            errorMessage={errors.email?.message}
          />
          <FormTextInput
            id="password"
            icon={IconLockPassword}
            iconClassName="text-white"
            placeholder="Heslo"
            bottomLabel="Minumum 8 znakov."
            type="password"
            isRequired
            errorMessage={errors.password?.message}
          />
          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Vytváranie účtu..." : "Registrovať sa"}
            <IconArrowNarrowRight />
          </Button>
        </form>
      </Form>
    </div>
  );
};
