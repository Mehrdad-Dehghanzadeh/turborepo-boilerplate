'use client'
import useSnackbar from '@hooks/useSnackbar'
import apis from '@apis'
import { KButton, KFieldset, KInfo, KLoading } from '@components/kits'
import Repayments, { Installments } from '@models/Repayments'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Paper from '@mui/material/Paper'
import { Box, Chip, Grid, Typography } from '@mui/material'
import { enumsProvider } from '@utils/enums'
import useFilters from '@hooks/useFilters'
import { utcToJalali } from '@utils/date'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useRouter } from 'next/navigation'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function LeaseRepayments() {
  const params = useSearchParams()
  const leaseUuid = params.get('leaseUuid')
  const [loading, setLoading] = useState<boolean>(false)
  const [repaymentData, setRepaymentData] = useState<Repayments | null>(null)
  const { snackbar } = useSnackbar()
  const { price } = useFilters()
  const router = useRouter()
  const redirect = () => router.back()

  const getRepayments = () => {
    setLoading(true)
    apis.repayment
      .read(leaseUuid)
      .then(({ data }: { data: Repayments }) => {
        setRepaymentData(data)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getRepayments()
  }, [])

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
      <Paper component="section" sx={{ padding: '16px' }}>
        <KFieldset title="اطلاعات بازپرداخت">
          <Grid container>
            <Grid xs={12} md={6} item>
              <KInfo
                title="مبلغ کل بازپرداخت"
                value={price(repaymentData?.totalRepaymentAmount)}
              />
            </Grid>

            <Grid xs={12} md={6} item>
              <KInfo
                title="مبلغ پرداخت شده"
                value={price(
                  repaymentData?.totalRepaymentAmount -
                    repaymentData?.totalRemainingAmount
                )}
              />
            </Grid>

            <Grid xs={12} md={6} item>
              <KInfo
                title="مبلغ کل باقی مانده"
                value={price(repaymentData?.totalRemainingAmount)}
              />
            </Grid>

            <Grid xs={12} md={6} item>
              <KInfo
                title="مدت بازپرداخت"
                value={repaymentData?.repaymentSchedule.term}
              />
            </Grid>

            <Grid xs={12} md={6} item>
              <KInfo
                title="دوره بازپرداخت"
                value={
                  enumsProvider(
                    'FrequencyList',
                    repaymentData?.repaymentSchedule?.paymentFrequency
                  )?.title
                }
              />
            </Grid>

            {repaymentData?.chequesApproved !== BooleanPlus.NA && (
              <Grid md={12} item>
                <KButton
                  color="primary"
                  variant="contained"
                  onClick={() => router.push(`repayment-cheques?leaseUuid=${leaseUuid}`)}
                  sx={{ margin: '20px 0' }}
                >
                  مشاهده چک های بازپرداخت
                </KButton>

                <KButton
                  color="primary"
                  variant="contained"
                  sx={{ margin: '20px 10px' }}
                  onClick={() =>
                    router.push(
                      `view-cheques-inquiry?repaymentUuid=${repaymentData?.uuid}`
                    )
                  }
                >
                  مشاهده استعلام
                </KButton>
              </Grid>
            )}
          </Grid>
        </KFieldset>
      </Paper>

      <div className="installment-list">
        {repaymentData?.installments.map((item: Installments, index: number) => (
          <Box className="installment-list_item" key={`${index}-${item.uuid}`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">قسط «{item?.order}»</Typography>
              <Typography variant="subtitle2">{price(item?.amount)}</Typography>
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: enumsProvider('PaymentStatusList', item.paymentStatus)?.color
                }}
              >
                {enumsProvider('PaymentStatusList', item.paymentStatus)?.title ??
                  'وضیعت پرداخت نامشخص'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-bg-400)' }}>
                {utcToJalali(item?.dueDate)}
              </Typography>
            </Box>

            <Chip
              label={enumsProvider('DueStatusList', item.dueStatus)?.title}
              color={enumsProvider('DueStatusList', item.dueStatus)?.color}
              size="small"
              variant="outlined"
              sx={{ marginTop: '5px' }}
            />
          </Box>
        ))}
      </div>
    </>
  )
}
