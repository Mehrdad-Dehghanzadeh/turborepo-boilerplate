'use client'
import { hasLogin } from '@utils/auth'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@store'
import { useCallback, useState, useEffect } from 'react'

type PropsType = {
  children: React.ReactNode
}

export default function ({ children }: Readonly<PropsType>) {
  const [token, setToken] = useState<boolean>(false)
  const updateUser = useAppStore((state) => state.updateUser)
  const router = typeof window == 'undefined' ? null : useRouter()

  function authenticate(): void {
    if (!hasLogin()) {
      router?.replace('/login')
    }
  }
  authenticate()

  const callBack = useCallback(() => {
    async function getInfo() {
      try {
        await updateUser()
        setToken(true)
      } catch (err) {
        setToken(false)
      }
    }
    getInfo()
  }, [])

  useEffect(() => {
    callBack()
  }, [])

  return <>{token && children}</>
}
