import { KButton, KFieldset, KInfo } from '@components/kits'
import { BooleanPlus } from '@enums/BooleanPlus'
import { utcToJalali, utcToJalaliAll } from '@utils/date'
import { enumsProvider } from '@utils/enums'
import { Box, Chip, Grid, Paper } from '@mui/material'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import useFilters from '@hooks/useFilters'
import ChequeEditForm from './chequeEditForm'
import { RepaymentContext } from '@context/RepaymentContext'
import { useContext, useState } from 'react'
import useSnackbar from '@hooks/useSnackbar'
import apis from '@apis'

type PropsType = {
  inquiryResult: any
  handleApproveChequeInquiry: () => void
  handleCanceleChequeInquiry: () => void
  handleWithdrewChequeInquiry: () => void
  inquiryApproveLoading: boolean
  inquiryCanceleLoading: boolean
  inquiryWithdrewLoading: boolean
  getChequeInquiry: () => void
}

export default function InquiryResult({
  inquiryResult,
  handleApproveChequeInquiry,
  handleCanceleChequeInquiry,
  handleWithdrewChequeInquiry,
  inquiryApproveLoading,
  inquiryCanceleLoading,
  inquiryWithdrewLoading,
  getChequeInquiry
}: Readonly<PropsType>) {
  const { price } = useFilters()
  const [isEdit, setIsEdit] = useState<Record<number, boolean>>({})
  const [chequeIndex, setChequeIndex] = useState<number>(0)
  const [cheque, setCheque] = useState<any>(null)
  const { snackbar } = useSnackbar()
  const { repaymentData } = useContext(RepaymentContext)
  const [loading, setLoading] = useState<boolean>(false)

  const toggleEdit = (index: number) => {
    setIsEdit((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const createPayload = (identifier: any) => {
    const payload = {
      type: 'REPAYMENT_CHEQUE',
      subjectUuid: repaymentData?.uuid,
      chequeParameters: {
        identifier,
        amount: cheque?.parameters?.cheque?.amount,
        dueDate: cheque?.parameters?.cheque?.dueDate
      }
    }

    return payload
  }

  const handleEditInquiry = ({ identifier }: any) => {
    setLoading(true)
    const payload = createPayload(identifier)
    const inquiryUuid = cheque?.uuid
    const successMsg =
      'ویرایش شما با موفقیت ثبت شد. لطفاً برای نهایی شدن تغییرات، روی دکمه "ارسال مجدد استعلام" کلیک کنید.'

    apis.inquiry
      .editInquiry(inquiryUuid, payload)
      .then(() => {
        snackbar('success', successMsg)
        toggleEdit(chequeIndex)
        getChequeInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const resendInquiryBatch = () => {
    setLoading(true)
    const inquiryUuid = inquiryResult?.uuid

    const payload = {
      done: BooleanPlus.REQUESTED,
      type: 'REPAYMENT_CHEQUE'
    }

    apis.inquiry
      .resendInquiryBatch(inquiryUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت ارسال شد')
        getChequeInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  return (
    <Paper
      component="section"
      sx={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px 0'
      }}
    >
      {inquiryResult?.done === BooleanPlus.REQUESTED && (
        <>
          <Alert severity="warning">
            <AlertTitle>وضیعت استعلام</AlertTitle>
            در انتظار نتیجه
          </Alert>

          <Alert severity="info">
            برای مشاهده نتیجه، پس از چند دقیقه صفحه را بروزرسانی کنید.
          </Alert>
        </>
      )}

      {inquiryResult?.done === BooleanPlus.GRANTED && (
        <Alert severity="success">
          <AlertTitle>وضیعت استعلام</AlertTitle>
          انجام شده
        </Alert>
      )}

      {inquiryResult?.done === BooleanPlus.RETURNED && (
        <>
          <Alert severity="error">
            <AlertTitle>وضیعت استعلام</AlertTitle>
            برگشت جهت ویرایش
          </Alert>

          <Alert severity="info">
            لطفاً پس از ویرایش، برای ثبت نهایی تغییرات، روی دکمه "ارسال مجدد استعلام" کلیک
            کنید.
          </Alert>
        </>
      )}

      {inquiryResult?.done === BooleanPlus.CANCELED && (
        <Alert severity="warning">
          <AlertTitle>وضیعت استعلام</AlertTitle>
          لغو شده توسط کاربر
        </Alert>
      )}

      {inquiryResult?.done === BooleanPlus.REJECTED && (
        <Alert severity="warning">
          <AlertTitle>وضیعت استعلام</AlertTitle>
          رد شده ( عدم پاسخ سرویس دهنده )
        </Alert>
      )}

      {inquiryResult?.chequeInquiries?.map((res: any, index: number) => (
        <KFieldset title={`استعلام چک شماره ${index + 1}`} key={index}>
          <Grid container>
            <Grid xs={12} md={4} lg={6} item>
              <KInfo
                title="وضیعت"
                value={
                  <Chip
                    label={enumsProvider('AuthenticationList', res?.done?.status)?.title}
                    color={enumsProvider('AuthenticationList', res?.done?.status)?.color}
                    size="small"
                    variant="outlined"
                  />
                }
              />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="زمان انجام" value={utcToJalaliAll(res?.done?.issueTime)} />
            </Grid>

            {res?.done?.issueTime && (
              <Grid xs={12} md={4} lg={6} item>
                <KInfo title="زمان تایید" value={utcToJalaliAll(res?.done?.issueTime)} />
              </Grid>
            )}

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="شناسه چک" value={res?.result?.chequeInfo?.identifier} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="سریال چک" value={res?.result?.chequeInfo?.serial} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="دارنده چک" value={res?.result?.chequeInfo?.owner} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="موعد پرداخت" value={res?.result?.chequeInfo?.actionDate} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="عنوان چک" value={res?.result?.chequeInfo?.branchTitle} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="کد شعبه" value={res?.result?.chequeInfo?.branchCode} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="کدرهگیری استعلام" value={res?.trackingCode} />
            </Grid>

            <Grid xs={12} sx={{ marginBottom: '15px' }}>
              <Divider>
                <Chip label="اطلاعات جهت درج در چک" size="small" color="info" />
              </Divider>
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="مبلغ" value={price(res?.result?.chequeInfo?.amount)} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo
                title="تاریخ"
                value={utcToJalali(res?.result?.chequeInfo?.dueDate)}
              />
            </Grid>

            {res?.done?.status === BooleanPlus.RETURNED && (
              <Grid xs={12} item>
                <KButton
                  variant="contained"
                  color="info"
                  sx={{ display: 'block', marginLeft: 'auto' }}
                  onClick={() => {
                    setChequeIndex(index)
                    setCheque(res)
                    toggleEdit(index)
                  }}
                >
                  {isEdit[index] ? 'بستن' : 'ویرایش'}
                </KButton>
              </Grid>
            )}

            {isEdit[index] && (
              <Grid xs={12} item>
                <ChequeEditForm loading={loading} handleEditInquiry={handleEditInquiry} />
              </Grid>
            )}
          </Grid>
        </KFieldset>
      ))}

      {inquiryResult?.done === BooleanPlus.GRANTED && (
        <Box sx={{ display: 'flex', gap: '0 5px' }}>
          <KButton
            color="primary"
            sx={{ width: '150px' }}
            variant="contained"
            onClick={handleApproveChequeInquiry}
            loading={inquiryApproveLoading}
          >
            تایید استعلام
          </KButton>

          <KButton
            color="error"
            sx={{ width: '150px' }}
            variant="contained"
            onClick={handleWithdrewChequeInquiry}
            loading={inquiryWithdrewLoading}
          >
            رد استعلام
          </KButton>
        </Box>
      )}

      {inquiryResult?.done === BooleanPlus.RETURNED && (
        <Box sx={{ display: 'flex', gap: '0 5px' }}>
          <KButton
            color="primary"
            sx={{ width: '150px' }}
            variant="contained"
            onClick={resendInquiryBatch}
            loading={loading}
          >
            ارسال مجدد استعلام
          </KButton>

          <KButton
            color="error"
            sx={{ width: '150px' }}
            variant="contained"
            onClick={handleCanceleChequeInquiry}
            loading={inquiryCanceleLoading}
          >
            لغو استعلام
          </KButton>
        </Box>
      )}
    </Paper>
  )
}
