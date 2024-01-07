import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await db.verificarionToken.findFirst({
      where: {
        email
      }
    })

    return verificationToken;
  } catch {
    return null
  }
};

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await db.verificarionToken.findUnique({
      where: {
        token
      }
    })

    return verificationToken;
  } catch {
    return null
  }
};