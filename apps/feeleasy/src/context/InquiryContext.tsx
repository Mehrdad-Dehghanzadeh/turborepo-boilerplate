import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const InquiryContext = createContext<any>({})

type PropsType = {
  children: React.ReactNode
  subjectUuid: string
}

export function InquiryResultProvider({ children, subjectUuid }: Readonly<PropsType>) {
  const [inquiryResult, setInquiryResult] = useState<any[]>([])
  const [kycResult, setKycResult] = useState<any>(null)
  const [scoringResult, setScoringResult] = useState<any>(null)
  const [repaymentChequeResult, setRepaymentChequeResult] = useState<any>(null)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)

  const getInquiryResult = (subjectUuid: string) => {
    setLoading(true)
    apis.inquiry
      .getInquiryBatchResult({ subjectUuid })
      .then(({ data }: any) => {
        setInquiryResult(data)
        setKycResult(data.KYC)
        setScoringResult(data.SCORING)
        setRepaymentChequeResult(data.REPAYMENT_CHEQUE)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const value = useMemo(
    () => ({
      inquiryResult,
      kycResult,
      scoringResult,
      repaymentChequeResult,
      getInquiryResult,
      loading
    }),
    [inquiryResult, loading]
  )

  useEffect(() => {
    getInquiryResult(subjectUuid)
  }, [])

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
}

export const useInquiry = () => useContext(InquiryContext)
