export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/operador/:path*', '/admin/:path*', '/mis-reservas', '/perfil', '/reservar'],
}
