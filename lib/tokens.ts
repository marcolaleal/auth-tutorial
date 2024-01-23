import crypto from "crypto";
import {v4 as uuidv4} from "uuid";

import { db } from "@/lib/db";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";

export const generateTwoFactorToken = async (email: string) => {
  //cria o token de 6 digitos aleatorios
  const token = crypto.randomInt(100_000,1_000_000).toString();

  //ToDo mudar a validade do token para 15 min
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if(existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      expires,
      token,
    }
  });

  return twoFactorToken
}


export const generatePasswordResetToken = async (email:string) => {
  
  //cria o token
  const token = uuidv4();

  //data e hora que o token vai expirar, data atual + 1 hora
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //consulta se existe um token criado para esse email
  const existingToken = await getPasswordResetTokenByEmail(email);

  //se existir, exclui o token antigo para ser gerado um novo token
  if(existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //grava o novo token no banco de dados
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken 
}

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

  //grava o novo token no banco de dados
  const verificationToken = await db.verificarionToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken
}