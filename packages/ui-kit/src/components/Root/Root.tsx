import type { TRoot } from './TRoot'
import React from 'react'
import '@repo/styles/variables/_colors.scss'
import '@repo/styles/custom/index.scss'

const Root: React.FC<TRoot> = ({ children }) => {
  return <>{children}</>
}

export default Root
