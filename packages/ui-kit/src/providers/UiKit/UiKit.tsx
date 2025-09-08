'use client'
import type { TProps } from './TUiKit'
import type { TTheme } from '@repo/shared-types/Colors'
import React, { createContext, useState } from 'react'

export const UikitContext = createContext({})

const UikitProvider: React.FC<TProps> = ({ children }) => {
  const [theme, setTheme] = useState<TTheme>('light')

  return (
    <UikitContext.Provider value={{ theme, setTheme }}>{children}</UikitContext.Provider>
  )
}

export default UikitProvider
