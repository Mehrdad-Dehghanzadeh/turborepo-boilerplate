import { useForm } from 'react-hook-form'
import { KButton, KFieldset, KInfo } from '@components/kits'
import { KFileUpload } from '@components/kits/KFileUpload/KFileUpload'
import { Alert, Box, Grid, Typography } from '@mui/material'
import { utcToJalali } from '@utils/date'
import repaymentCheque from '@models/RepaymentCheques'
import { useContext, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { convertPersianToEnglishNumbers } from '@utils/number'
import { BooleanPlus } from '@enums/BooleanPlus'
import { RepaymentContext } from '@context/RepaymentContext'
import useFilters from '@hooks/useFilters'
import { enumsProvider } from '@utils/enums'

type PropsType = {
  cheque: repaymentCheque
  index: number
  getRepaymentCheques: () => void
}

export default function ChequeUploadForm({
  cheque,
  getRepaymentCheques,
  index
}: Readonly<PropsType>) {
  const { control, handleSubmit } = useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const { price } = useFilters()

  const { repaymentData } = useContext(RepaymentContext)

  const appUrl = process.env.NEXT_PUBLIC_API_URL

  const handleUploadFile = (data: any) => {
    setLoading(true)
    const chequeUuid = convertPersianToEnglishNumbers(cheque?.uuid)

    const formData = new FormData()
    formData.append('file', data.file)

    apis.repaymentCheques
      .postImage(chequeUuid, formData)
      .then(() => {
        snackbar('success', 'تصویر چک با موفقیت ثبت شد')
        getRepaymentCheques()
      })
      .catch((err: Error) => {
        snackbar('error', 'حجم فایل مورد نظر زیاد است')
      })
      .finally(() => setLoading(false))
  }

  return (
    <KFieldset title={`چک قسط ${index + 1}`} key={index}>
      <Grid container>
        <Grid xs={12} md={4} lg={6} item>
          <KInfo title="شناسه" value={cheque?.identity} />
        </Grid>

        <Grid xs={12} md={4} lg={6} item>
          <KInfo title="شماره سریال" value={cheque?.serial} />
        </Grid>

        <Grid xs={12} md={4} lg={6} item>
          <KInfo title="دارنده چک" value={cheque?.owner} />
        </Grid>

        <Grid xs={12} md={4} lg={6} item>
          <KInfo title="مبلغ" value={price(cheque?.amount)} />
        </Grid>

        <Grid xs={12} md={4} lg={6} item>
          <KInfo title="تاریخ" value={utcToJalali(cheque?.dueDate)} />
        </Grid>

        <Grid xs={12} md={4} lg={6} item>
          <KInfo title="بانک" value={cheque?.bankInfo?.bank} />
        </Grid>

        <Grid xs={12} md={4} lg={6} item>
          <KInfo
            title="شعبه"
            value={enumsProvider('BankNamesList', cheque?.bankInfo?.branchName)?.title}
          />
        </Grid>

        <Grid xs={12} md={4} lg={6} item>
          <KInfo title="کد شعبه" value={cheque?.bankInfo?.branchCode} />
        </Grid>

        {(repaymentData?.chequesApproved === BooleanPlus.NA ||
          repaymentData?.chequesApproved === BooleanPlus.RETURNED) && (
          <Grid xs={12} md={12}>
            {!cheque?.imagePath && (
              <Alert severity="info" sx={{ my: 5 }}>
                لطفاً تصویر واضحی از چک خود را انتخاب کنید و سپس روی دکمه "بارگذاری و
                ادامه" کلیک کنید.
              </Alert>
            )}

            <form onSubmit={handleSubmit(handleUploadFile)}>
              <KFileUpload
                name="file"
                control={control}
                isRequired
                inputText={cheque?.imagePath && 'انتخاب مجدد'}
              />
              <KButton
                variant="contained"
                color="success"
                type="submit"
                loading={loading}
              >
                بارگذاری و ادامه
              </KButton>
            </form>
          </Grid>
        )}

        <Grid item xs={12} sx={{ marginTop: '20px' }}>
          {cheque?.imagePath && (
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
              src={`${appUrl}/${cheque?.imagePath}`}
            />
          )}
        </Grid>
      </Grid>
    </KFieldset>
  )
}
