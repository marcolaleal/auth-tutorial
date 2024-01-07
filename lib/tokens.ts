import {v4 as uuidv4} from "uuid";

import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export const generateVerificationToken = async (email:string) => {
  
  //cria o token
  const token = uuidv4();

  //data e hora que o token vai expirar, data atual + 1 hora
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //consulta se existe um token criado para esse email
  const existingToken = await getVerificationTokenByEmail(email);

  //se existir, exclui o token antigo para ser gerado um novo token
  if(existingToken) {
    await db.verificarionToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //cria novo token
  const verificationToken = await db.verificarionToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken
}