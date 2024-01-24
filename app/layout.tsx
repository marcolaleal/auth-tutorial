import type { Metadata } from 'next'
import { auth } from '@/auth';
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth',
  description: 'Um simples app de Auth',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="pt-br">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
