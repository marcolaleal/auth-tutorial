import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendverificationEmail = async (
  email: string,
  token: string
) => {
  const confirmeLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "auth@amigododinheiro.com",
    to: email,
    subject: "Confirme seu email",
    html: `<p>Clique  <a href="${confirmeLink}">Aqui</a> para confirmar seu email</p>`
  });
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "auth@amigododinheiro.com",
    to: email,
    subject: "Crie uma nova senha",
    html: `<p>Clique  <a href="${resetLink}">Aqui</a> para criar uma nova senha</p>`
  });
}

export const sendTwoFactorTokenEmail =async (email:string, token: string) => {
  
  await resend.emails.send({
    from: "auth@amigododinheiro.com",
    to: email,
    subject: "Seu codigo de segurança chegou!",
    html: `<p>Seu codigo de segurança é: <strong>${token}</strong></p>`
  });
}