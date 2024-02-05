"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendverificationEmail } from "@/lib/mail";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "Acesso Negado"};
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Acesso Negado"};
  }

  if(user.isOAuth) {
    values.email = undefined;
    values.isTwoFactorEnabled = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if(values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return {error: "já existe um usuario com este email"};
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendverificationEmail(verificationToken.email, verificationToken.token);

    return {success: "Email de verificação enviado!"};
  }

  if(values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(values.password,dbUser.password);

    if(!passwordsMatch) {
      return {error: "Senha inválida!"};
    }

    const hashedPassword = await bcrypt.hash(values.newPassword,10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }



  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  });

  return {succsess: " Usuario atualizado com sucesso!"}
}