import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@acme/ui/button";

import { auth, getSession } from "~/auth/server";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export async function AuthShowcase() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center gap-8">
        <SignInForm />
        <SignUpForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
