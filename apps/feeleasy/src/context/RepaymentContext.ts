import Repayments from '@models/Repayments'
import { createContext } from 'react'

type RepaymentContextState = {
  repaymentData: Repayments | null
}

type RepaymentContextAction = {
  setRepaymentData?: (data: Repayments) => void
}

type RepaymentContextType = RepaymentContextState & RepaymentContextAction

export const RepaymentContext = createContext<RepaymentContextType>({
  repaymentData: null,
  setRepaymentData: () => {}
})
