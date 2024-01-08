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