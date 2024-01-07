"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendverificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos Inválidos"}
  }

  const { email, password } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if( !existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email ou senha inválido"};
  }

  if(!existingUser.emailVerified) {
    const verificarionToken = await generateVerificationToken(existingUser.email)

    await sendverificationEmail(verificarionToken.email, verificarionToken.token)

    return { success: "Email de confirmação enviado!"}
  }


  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha inválido"}
        default:
          return {error: "Algo deu errado..."}
      }
    }

    throw error;
  }
};