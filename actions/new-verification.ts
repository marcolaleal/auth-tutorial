"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if(!existingToken) {
    return { error: "Não existe um token para validação" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if(hasExpired) {
    return { error: "o token de verificação expirou!" }
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Usuário não encontrado!" }
  }

  await db.user.update({
    where: {
      id: existingUser.id
    },
    data:{
      emailVerified: new Date(),
      email: existingToken.email,
    }
  })

  await db.verificarionToken.delete({
    where: {
      id: existingToken.id
    }
  })

  return {success: "Email verificado com sucesso!"}
} 