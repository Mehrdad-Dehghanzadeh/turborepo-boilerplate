'use client'
import { KButton } from '@components/kits'
import { useSearchParams } from 'next/navigation'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useRouter } from 'next/navigation'
import InquiryResult from './view'
import { InquiryResultProvider } from '@context/InquiryContext'

export default function ViewChequesInquiry() {
  const params = useSearchParams()
  const repaymentUuid = params.get('repaymentUuid') ?? ''
  const router = useRouter()
  const redirect = () => router.back()

  return (
    <>
      <KButton
        startIcon={<ArrowForwardIcon />}
        color="info"
        size="large"
        sx={{ marginBottom: '16px' }}
        onClick={redirect}
      >
        بازگشت
      </KButton>

      <InquiryResultProvider subjectUuid={repaymentUuid}>
        <InquiryResult />
      </InquiryResultProvider>
    </>
  )
}
