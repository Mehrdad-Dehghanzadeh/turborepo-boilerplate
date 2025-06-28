'use client'
import { useSearchParams } from 'next/navigation'
import InquiryResult from './view'
import { useEffect, useState } from 'react'
import { KButton, KLoading } from '@components/kits'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { useRouter } from 'next/navigation'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'

export default function ViewGuaranteeInquiry() {
  const params = useSearchParams()
  const [inquiryResult, setInquiryResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const guaranteeUuid = params.get('guaranteeUuid')
  const chequeUuid = params.get('chequeUuid')
  const { snackbar } = useSnackbar()
  const router = useRouter()
  const redirect = () => router.back()

  const getInquiry = () => {
    setLoading(true)

    const params = {
      subjectUuid: guaranteeUuid,
      secondaryId: chequeUuid
    }

    apis.inquiry
      .getInquiry(params)
      .then(({ data }: { data: any }) => {
        setInquiryResult(data?.[0])
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getInquiry()
  }, [guaranteeUuid, chequeUuid])

  if (loading) return <KLoading />

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

      {inquiryResult ? (
        <InquiryResult inquiryResult={inquiryResult} />
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', color: 'var(--color-gray-500)' }}
        >
          استعلام انجام نشده است
        </Typography>
      )}
    </>
  )
}
