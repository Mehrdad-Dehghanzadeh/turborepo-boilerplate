import { Offerings } from '@models/offering'
import { createContext } from 'react'

type VoucherStates = {
  vouchersResult: any
  loading: boolean
  availableVouchers: string[] | null
  payableItems: Offerings[] | null
  currentCaller: string | null
}
type VoucherActions = {
  getVouchers?: (arg: string) => void
  checkVouchers?: () => void
}

type VoucherContextType = VoucherStates & VoucherActions

export const VoucherContext = createContext<VoucherContextType>({
  loading: false,
  vouchersResult: [],
  availableVouchers: null,
  payableItems: null,
  currentCaller: null
})
