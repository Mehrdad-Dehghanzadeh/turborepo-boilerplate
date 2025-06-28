import { getCookie, hasCookie, setCookie, deleteCookie } from 'cookies-next'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import apis from '@apis'

export const homePagePath = '/'
export const loginPagePath = '/login'
export const tokenCookieName = 'token'
export const uuidCookieName = 'uuid'

export function redirectTo(path: string) {
  if (window) {
    const router = useRouter()
    router.replace(path)
  }
}

export function getToken() {
  // return getCookie(tokenCookieName)
  return getCookie(uuidCookieName)
}

export function setToken(token: string) {
  return new Promise((resolve, reject) => {
    if (token) {
      const jwtObject: any = jwtDecode(token)
      if (jwtObject?.exp < Date.now() * 1000 && jwtObject?.uuid) {
        setCookie(tokenCookieName, token, {
          sameSite: true,
          expires: new Date(jwtObject.exp),
          path: '/'
        })
        resolve(jwtObject)
      } else {
        reject(new Error('jwt is not valid'))
      }
    } else {
      reject(new Error('token is not jwt'))
    }
  })
}

export function removeToken() {
  deleteCookie(tokenCookieName)
  deleteCookie(uuidCookieName)
}

export function hasLogin(): boolean {
  // return hasCookie(tokenCookieName) && !!getUserInfo()?.username
  return hasCookie(uuidCookieName)
}

export function authenticate(): void {
  if (!hasLogin()) {
    redirectTo(loginPagePath)
  }
}

export function setUUID(uuid: string): void {
  setCookie(uuidCookieName, uuid, {
    sameSite: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: '/'
  })
}

export function logout() {
  deleteCookie(tokenCookieName)
  deleteCookie(uuidCookieName)
}

// export function getUserInfo() {
//   const jwt = <string>getCookie(tokenCookieName)
//   const { user }: any = jwt ? jwtDecode(jwt) : null
//   return user
// }

export function getUserInfo() {
  const uuid = <string>getCookie(uuidCookieName)

  return new Promise((resolve, reject) => {
    apis.users
      .getInfo(uuid)
      .then((res: any) => {
        resolve(res.data)
      })
      .catch(() => {
        logout()
        reject(new Error('متاسفانه مشکلی در دریافت اطلاعات کاربر وجود دارد !'))
      })
  })
}
