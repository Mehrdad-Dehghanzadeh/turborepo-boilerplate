'use client'
import { InquiryResultProvider } from '@context/InquiryContext'
import { useSearchParams } from 'next/navigation'
import InquiryResult from './view'
import { KButton } from '@components/kits'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useRouter } from 'next/navigation'

export default function ViewKycInquiry() {
  const params = useSearchParams()
  const subjectUuid = params.get('uuid') ?? ''

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

      <InquiryResultProvider subjectUuid={subjectUuid}>
        <InquiryResult />
      </InquiryResultProvider>
    </>
  )
}
