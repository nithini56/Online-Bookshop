import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email?: string | null
    }
  }

  interface User {
    id: string
    username: string
    email?: string | null
  }
}
