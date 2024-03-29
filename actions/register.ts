"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendverificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos Inválidos"}
  }

  const { email, password, name} = validateFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

const existingUser = await getUserByEmail(email);

if (existingUser) {
  return { error: "Já existe uma conta com esse email"};
}

await db.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
  }
});

const verificarionToken = await generateVerificationToken(email);
  
  await sendverificationEmail(verificarionToken.email,verificarionToken.token )

  return { success: "Email de confirmação enviado!"};
};