import type { TRoot } from './TRoot'
import React from 'react'
import '@repo/styles/variables'
import '@repo/styles/custom'

const Root: React.FC<TRoot> = ({ children }) => {
  return <>{children}</>
}

export default Root
