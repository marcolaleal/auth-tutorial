import NextAuth, { DefaultSession, Session } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "./lib/db"
import authConfig from "@/auth.config"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account"

declare module "@auth/core/types" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"]
  } 
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    async signIn({ user, account}) {
      

      if(account?.provider !== "credentials") {
        return true
      }

      if(!user.id) {
        return false;
      }

      const existingUser = await getUserById(user.id)

      if(!existingUser?.emailVerified){
        return false;
      }
      
      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation) {
          return false;
        }

        //deletar two factor confirmation para o priximo login
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          },
        });
      }

      return true
    },
    async session({ token, session }: {token?: any; session: Session}) {
      if( token.sub && session.user) {
        session.user.id = token.sub;
      }
      if( token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if(session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      if(session.user){
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
      }

      return session;
    },
    async jwt({ token }) {
      if(!token.sub) {
        return token;
      };

      const existingUser = await getUserById(token.sub)

      if(!existingUser) {
        return token;
      };

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  ...authConfig,
})