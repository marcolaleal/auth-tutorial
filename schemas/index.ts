import * as z from "zod";

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

