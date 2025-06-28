import { createContext } from 'react'

type LeaseRequestContextStates = {
  filters: any
  protocols: any[]
}

type LeaseRequestContextActions = {
  setFilters?: (val: boolean) => void
  resetTable?: () => void
}

export type LeaseRequestContextType = LeaseRequestContextActions &
  LeaseRequestContextStates

export const LeaseRequestContext = createContext<LeaseRequestContextType>({
  filters: null,
  protocols: []
})
