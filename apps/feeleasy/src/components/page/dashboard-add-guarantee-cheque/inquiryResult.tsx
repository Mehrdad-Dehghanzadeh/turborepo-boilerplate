import { BooleanPlus } from '@enums/BooleanPlus'
import { KButton, KFieldset, KInfo } from '@components/kits'
import { Grid, Paper } from '@mui/material'
import { useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

type PropsType = {
  inquiryApproveLoading: boolean
  setIsEdit: (value: boolean) => void
  setNewInquiry: (value: boolean) => void
  inquiryResult: any
  approveChequeInquiry: () => void
  getInquiry: () => void
}

export default function InquiryResult({
  inquiryApproveLoading,
  inquiryResult,
  approveChequeInquiry,
  setIsEdit,
  setNewInquiry,
  getInquiry
}: Readonly<PropsType>) {
  const [inquiryWithdrewLoading, setInquiryWithrewLoading] = useState<boolean>(false)
  const [inquiryCancelLoading, setInquiryCancelLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const inquiryUuid = inquiryResult?.uuid

  const withdrewChequeInquiry = () => {
    setInquiryWithrewLoading(true)

    const payload = {
      done: BooleanPlus.WITHDREW
    }

    apis.inquiry
      .modifyInquiryResult(inquiryUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        getInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setInquiryWithrewLoading(false))
  }

  const cancelChequeInquiry = () => {
    setInquiryCancelLoading(true)

    const payload = {
      done: BooleanPlus.CANCELED
    }

    apis.inquiry
      .modifyInquiryResult(inquiryUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت لغو شد')
        getInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setInquiryWithrewLoading(false))
  }

  return (
    <>
      {inquiryResult?.done?.status === BooleanPlus.REQUESTED && (
        <Alert severity="warning" sx={{ margin: '15px 0' }}>
          <AlertTitle>وضیعت استعلام</AlertTitle>
          در انتظار نتیجه
        </Alert>
      )}

      {inquiryResult?.done?.status === BooleanPlus.GRANTED && (
        <Alert severity="success" sx={{ margin: '15px 0' }}>
          <AlertTitle>وضیعت استعلام</AlertTitle>
          انجام شده
        </Alert>
      )}

      {inquiryResult?.done?.status === BooleanPlus.CONFIRMED && (
        <Alert severity="success" sx={{ margin: '15px 0' }}>
          <AlertTitle>وضیعت استعلام</AlertTitle>
          تایید شده
        </Alert>
      )}

      {inquiryResult?.done?.status === BooleanPlus.WITHDREW && (
        <Alert severity="error" sx={{ margin: '15px 0' }}>
          <AlertTitle>وضیعت استعلام</AlertTitle>
          رد شده توسط کاربر
        </Alert>
      )}

      {inquiryResult?.done?.status === BooleanPlus.CANCELED && (
        <Alert severity="error" sx={{ margin: '15px 0' }}>
          <AlertTitle>وضیعت استعلام</AlertTitle>
          لغو شده توسسط کاربر
        </Alert>
      )}

      {inquiryResult?.done?.status === BooleanPlus.RETURNED && (
        <Alert severity="error" sx={{ margin: '15px 0' }}>
          <AlertTitle>وضیعت استعلام</AlertTitle>
          برگشت جهت ویرایش
        </Alert>
      )}

      <Paper component="section" sx={{ padding: '16px' }}>
        <KFieldset title="استعلام">
          <Grid container>
            <Grid item xs={12} md={6}>
              <KInfo
                title="شناسه چک"
                value={inquiryResult?.result?.chequeInfo?.identifier}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="سریال چک" value={inquiryResult?.result?.chequeInfo?.serial} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="دارنده چک" value={inquiryResult?.result?.chequeInfo?.owner} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="مبلغ" value={inquiryResult?.result?.chequeInfo?.amount} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo
                title="کدشعبه"
                value={inquiryResult?.result?.chequeInfo?.branchCode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="کد رهگیری" value={inquiryResult?.trackingCode} />
            </Grid>

            {inquiryResult?.done?.status === BooleanPlus?.RETURNED && (
              <Grid
                xs={12}
                sx={{
                  display: 'flex',
                  gap: '0 10px',
                  margin: '10px 0',
                  justifyContent: 'end'
                }}
              >
                <KButton color="info" variant="outlined" onClick={() => setIsEdit(true)}>
                  ویرایش
                </KButton>

                <KButton
                  color="error"
                  variant="outlined"
                  onClick={cancelChequeInquiry}
                  loading={inquiryCancelLoading}
                >
                  لغو
                </KButton>
              </Grid>
            )}

            {inquiryResult?.done?.status === BooleanPlus.WITHDREW && (
              <Grid xs={12}>
                <KButton
                  color="info"
                  variant="outlined"
                  sx={{ display: 'block', marginLeft: 'auto', marginBottom: '5px' }}
                  onClick={() => setNewInquiry(true)}
                >
                  ثبت استعلام جدید
                </KButton>
              </Grid>
            )}

            {inquiryResult?.done?.status === BooleanPlus?.GRANTED && (
              <Grid
                item
                xs={12}
                sx={{
                  display: 'flex',
                  gap: '0 10px',
                  margin: '10px 0',
                  justifyContent: 'end'
                }}
              >
                <KButton
                  variant="contained"
                  color="success"
                  onClick={approveChequeInquiry}
                  loading={inquiryApproveLoading}
                >
                  تایید استعلام
                </KButton>

                <KButton
                  variant="contained"
                  color="error"
                  onClick={withdrewChequeInquiry}
                  loading={inquiryWithdrewLoading}
                >
                  رد استعلام
                </KButton>
              </Grid>
            )}
          </Grid>
        </KFieldset>
      </Paper>
    </>
  )
}
