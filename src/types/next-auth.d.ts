import NextAuth from 'next-auth'

type Role = 'USER' | 'OPERATOR' | 'ADMIN'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: Role
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
  }
}
