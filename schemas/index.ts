import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email("email inválido")),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6, "A senha precisa ter mais de 6 caracteres")),
})
  .refine((data) =>{
    if(data.password && !data.newPassword) {
      return false;
    }
    return true
  }, {
    message: "Campo novo password é obrigatório",
    path: ["newPassword"]
  })
  .refine((data) =>{
    if(!data.password && data.newPassword) {
      return false;
    }
    return true
  }, {
    message: "Campo password é obrigatório",
    path: ["Password"]
  })

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email inválido"
  }),
  password: z.string().min(1, {
    message: "Password é obrigatório"
  }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email inválido"
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6,{
    message: "A senha precisa ter no mínimo 6 caracteres"
  })
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email inválido"
  }),
  password: z.string().min(6, {
    message: "A senha precisa ter no mínimo 6 caracteres"
  }),
  name: z.string().min(1, {
    message: "Nome é um campo obrigatório"
  })
});

