import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export const config = {
  // Matcher entries are linked with a logical "or", therefore
  // if one of them matches, the middleware will be invoked.
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/users/(.+)'
  ]
}
export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createIntlMiddleware({
    defaultLocale: 'fa',
    locales: ['fa'],
    localeDetection: false,
    localePrefix: 'never'
  })
  const response = handleI18nRouting(request)

  return response
}
