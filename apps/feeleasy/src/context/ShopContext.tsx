import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { resourceOwnerConfig } from '@data/apisHeaderConfig'

const ShopContext = createContext<any>({})
type Porps = Readonly<{ children: React.ReactNode }>

export function ShopProvider({ children }: Porps) {
  const [shops, setShops] = useState<any[]>([])
  const { snackbar } = useSnackbar()

  const value = useMemo(() => ({ shops, setShops }), [shops])

  const getAllShop = () => {
    apis.shop
      .read({}, {})
      .then(({ data }: any) => {
        setShops(data ?? [])
      })
      .catch((err: Error) => snackbar(err))
  }

  useEffect(() => {
    getAllShop()
  }, [])

  return <ShopContext.Provider value={value}> {children} </ShopContext.Provider>
}

export const useShops = () => useContext(ShopContext)
