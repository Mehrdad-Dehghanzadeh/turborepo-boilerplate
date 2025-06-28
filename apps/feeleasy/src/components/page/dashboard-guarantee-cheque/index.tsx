'use client'
import useSnackbar from '@hooks/useSnackbar'
import apis from '@apis'
import Guarantee, {
  ApproveDto,
  Cheque,
  CollateralsOrDocuments,
  ReturnForUpdateDto
} from '@models/Guarantee'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Box, Chip, Grid, Paper } from '@mui/material'
import { KButton, KFieldset, KInfo, KLoading } from '@components/kits'
import { enumsProvider } from '@utils/enums'
import useFilters from '@hooks/useFilters'
import { useRouter } from 'next/navigation'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { utcToJalali } from '@utils/date'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function GuaranteeCheque() {
  const params = useSearchParams()
  const leaseUuid = params.get('leaseUuid')
  const { snackbar } = useSnackbar()
  const { price } = useFilters()

  const router = useRouter()
  const redirect = () => router.back()

  const [loading, setLoading] = useState<boolean>(false)
  const [chequeRefrenceUuid, setChequeRefrenceUuid] = useState<string>('')
  const [guaranteeInfo, setGuaranteeInfo] = useState<Guarantee | null>(null)
  const [chequeInfo, setChequeInfo] = useState<Cheque | null>(null)
  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const [returnLoading, setReturnLoading] = useState<boolean>(false)
  const [guaranteeUuid, setGuaranteeUuid] = useState<string>('')
  const [chequeUuid, setChequeUuid] = useState<string>('')

  const appUrl = process.env.NEXT_PUBLIC_API_URL

  const getGuarantee = () => {
    setLoading(true)
    apis.guarantee
      .read(leaseUuid)
      .then(({ data }: { data: Guarantee }) => {
        setGuaranteeInfo(data)
        if (data) {
          const chequeRefrenceUuid =
            data?.applicantCollaterals?.find(
              (item: CollateralsOrDocuments) => item.type === 'CHEQUE'
            )?.referenceUuid ?? ''

          const chequeUuid =
            data?.applicantCollaterals?.find(
              (item: CollateralsOrDocuments) => item.type === 'CHEQUE'
            )?.id ?? ''

          setChequeRefrenceUuid(chequeRefrenceUuid)
          setChequeUuid(chequeUuid)
          setGuaranteeUuid(data?.uuid)
        }
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const getGuaranteeCheque = () => {
    setLoading(true)

    apis.repaymentCheques
      .get(chequeRefrenceUuid)
      .then(({ data }: { data: Cheque }) => {
        setChequeInfo(data)
      })
      .catch((err: Error) => snackbar('err', err))
      .finally(() => setLoading(false))
  }

  const approveGuarantee = () => {
    setApproveLoading(true)
    const guaranteeUuid = guaranteeInfo?.uuid

    const approvePayload: ApproveDto = {
      approved: BooleanPlus.GRANTED
    }

    apis.guarantee
      .modifyState(guaranteeUuid, approvePayload)
      .then(() => {
        snackbar('success', 'با موفقیت تایید شد')
        getGuarantee()
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setApproveLoading(false))
  }

  const returnGuarantee = () => {
    setReturnLoading(true)
    const guaranteeUuid = guaranteeInfo?.uuid

    const returnPayload: ReturnForUpdateDto = {
      approved: BooleanPlus.RETURNED
    }

    apis.guarantee
      .modifyState(guaranteeUuid, returnPayload)
      .then(() => {
        snackbar('success', 'با موفقیت برگشت داده شد')
        getGuarantee()
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setReturnLoading(false))
  }

  useEffect(() => {
    getGuarantee()
  }, [leaseUuid])

  useEffect(() => {
    if (chequeRefrenceUuid) getGuaranteeCheque()
  }, [chequeRefrenceUuid])

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

      <Paper component="section" sx={{ padding: '16px', margin: '20px 0' }}>
        <KFieldset title="وثایق متقاضی">
          {guaranteeInfo?.applicantCollaterals.map(
            (collateral: CollateralsOrDocuments, index: number) => (
              <Grid container key={`collateral-${index}`}>
                <Grid item xs={12} md={6}>
                  <KInfo
                    title="نوع وثیقه"
                    value={enumsProvider('CollateralTypeList', collateral?.type)?.title}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo title="مقدار" value={price(collateral?.amount)} />
                </Grid>
              </Grid>
            )
          )}

          <Grid container sx={{ marginTop: '10px' }}>
            <Grid xs={12} md={6} item>
              <KInfo
                title="وضیعت تایید"
                value={
                  <Chip
                    label={enumsProvider('States', guaranteeInfo?.approved)?.title}
                    color={enumsProvider('States', guaranteeInfo?.approved)?.color}
                    variant="outlined"
                  />
                }
              />
            </Grid>

            <Grid xs={12} md={6} item sx={{ display: 'flex' }}>
              <KButton
                color="primary"
                variant="contained"
                sx={{ alignSelf: 'center' }}
                onClick={() =>
                  router.push(
                    `view-guarantee-inquiry?guaranteeUuid=${guaranteeUuid}&chequeUuid=${chequeUuid}`
                  )
                }
              >
                مشاهده استعلام
              </KButton>
            </Grid>
          </Grid>
        </KFieldset>
      </Paper>

      {chequeInfo && (
        <Paper component="section" sx={{ padding: '16px', margin: '20px 0' }}>
          <KFieldset title="اطلاعات چک ضمانت">
            <Grid container>
              <Grid item xs={12} md={6}>
                <KInfo title="سریال چک" value={chequeInfo?.serial} />
              </Grid>

              <Grid item xs={12} md={6}>
                <KInfo title="شناسه چک" value={chequeInfo?.identity} />
              </Grid>

              <Grid item xs={12} md={6}>
                <KInfo title="دارنده چک" value={chequeInfo?.owner} />
              </Grid>

              <Grid item xs={12} md={6}>
                <KInfo title="مبلغ" value={price(chequeInfo?.amount)} />
              </Grid>

              {chequeInfo?.dueDate && (
                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="تاریخ" value={utcToJalali(chequeInfo?.dueDate)} />
                </Grid>
              )}

              <Grid xs={12} md={4} lg={6} item>
                <KInfo
                  title="بانک"
                  value={
                    enumsProvider('BankNamesList', chequeInfo?.bankInfo?.bank)?.title
                  }
                />
              </Grid>

              <Grid xs={12} md={4} lg={6} item>
                <KInfo title="شعبه" value={chequeInfo?.bankInfo?.branchName} />
              </Grid>

              <Grid xs={12} md={4} lg={6} item>
                <KInfo title="کد شعبه" value={chequeInfo?.bankInfo?.branchCode} />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: '20px' }}>
                {chequeInfo?.imagePath && (
                  <Box
                    component="img"
                    sx={{
                      width: {
                        xs: '100%',
                        md: '50%'
                      },

                      borderRadius: '15px'
                    }}
                    alt="cheque image"
                    src={`${appUrl}/${chequeInfo?.imagePath}`}
                  />
                )}
              </Grid>
            </Grid>
          </KFieldset>
        </Paper>
      )}

      <Box
        sx={{
          paddingBottom: '20px',
          display: 'flex',
          gap: '0 5px',
          justifyContent: 'end'
        }}
      >
        <KButton
          variant="contained"
          color="success"
          onClick={approveGuarantee}
          loading={approveLoading}
          disabled={guaranteeInfo?.approved !== BooleanPlus.REQUESTED}
        >
          تایید اطلاعات
        </KButton>

        <KButton
          variant="contained"
          color="error"
          onClick={returnGuarantee}
          loading={returnLoading}
          disabled={guaranteeInfo?.approved !== BooleanPlus.REQUESTED}
        >
          برگشت جهت ویرایش
        </KButton>
      </Box>
    </>
  )
}
