import { createContext } from 'react'

type ProtocolContextStates = {
  loading?: boolean
  categories: any[]
  isEdit?: boolean
  editData?: any
}

type ProtocolContextActions = {
  setLoading?: (val: boolean) => void
  setCategories?: (val: any[]) => void
}

export type ProtocolContextType = ProtocolContextStates & ProtocolContextActions

export const ProtocolContext = createContext<ProtocolContextType>({
  loading: true,
  categories: [],
  isEdit: false,
  editData: null
})
