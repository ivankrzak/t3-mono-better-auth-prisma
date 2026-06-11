import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@acme/db";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
}) {
  const config = {
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
      }),
      expo(),
      // must stay last in the plugin array
      nextCookies(),
    ],
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: ["expo://"],
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
