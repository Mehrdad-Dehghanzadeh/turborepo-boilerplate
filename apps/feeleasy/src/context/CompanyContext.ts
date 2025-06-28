import { createContext } from 'react'

type CompanyContextStates = {
  loading: boolean
  companies: any[]
  selectedCompany: any
}

type CompanyContextActions = {
  setLoading?: (val: boolean) => void
  setCompanies?: (val: any[]) => void
  setSelectedCompany?: (val: any) => void
  getData?: () => void
}

export type CompanyContextType = CompanyContextStates & CompanyContextActions

export const CompanyContext = createContext<CompanyContextType>({
  loading: true,
  companies: [],
  selectedCompany: null
})
