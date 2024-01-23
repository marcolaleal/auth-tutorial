"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { sendverificationEmail,sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos Inválidos"}
  }

  const { email, password, code } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if( !existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email ou senha inválido"};
  }

  if(!existingUser.emailVerified) {
    const verificarionToken = await generateVerificationToken(existingUser.email)

    await sendverificationEmail(verificarionToken.email, verificarionToken.token)

    return { success: "Email de confirmação enviado!"}
  }

  if(existingUser.IsTwoFactorEnabled && existingUser.email) {
    if(code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken){
        return {error: "Codigo inválido"};
      }

      if (twoFactorToken.token !== code) {
        return {error: "Codigo inválido"};
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if(hasExpired){
        return {error: "Codigo inválido"};
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(existingConfirmation){
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    }else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token);
      return { twoFactor: true };
    }

    
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