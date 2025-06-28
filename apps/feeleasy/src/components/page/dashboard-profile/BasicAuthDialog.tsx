'use client'
import { KButton, KDatePicker, KTextField } from '@components-kits'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'
import { deepClone } from '@utils/object'
import { useAppStore } from '@store'
import { format } from '@utils/date'
import { AuthenticationDto } from '@models/Inquiry'
import apis from '@apis'
import { allowOnlyNumericKeyDown, allowOnlyNumericPaste } from '@utils/number'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const user = useAppStore((state) => state.user)
  const { snackbar } = useSnackbar()
  const { required } = useValidations()
  const [open, setOpen] = useState<boolean>(false)
  const { nationalCode, postalCode, mobile, iban } = useValidations()
  const [loading, setLoading] = useState<boolean>(false)
  const [inquiryResult, setInquiryResult] = useState<any>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { handleSubmit, control, reset } = useForm<AuthenticationDto>({
    defaultValues: {
      mobilePhoneNumber: user?.contactInfo.mobilePhoneNumber
    }
  })

  const onClose = () => {
    setOpen(false)
    setIsEdit(false)
    reset()
  }

  const showDialog = (info?: any) => {
    setInquiryResult(info)
    if (info) setDefaultValues(info)
    showCallBack?.()
    setOpen(true)
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  const createPayload = (data: AuthenticationDto) => {
    const payload = deepClone(data)
    payload.type = 'KYC'
    payload.iban = `IR${payload.iban}`
    payload.subjectUuid = user?.uuid
    payload.dateOfBirth = format(payload.dateOfBirth)
    return payload
  }

  const onSubmitForm = (data: AuthenticationDto) => {
    setLoading(true)
    const payload = createPayload(data)

    if (isEdit) {
      editInquiryBatch(payload)
    } else {
      postInquiryBatch(payload)
    }
  }

  const editInquiryBatch = (payload: AuthenticationDto) => {
    const inquiryUuid = inquiryResult.uuid
    apis.inquiry
      .editInquiryBatch(inquiryUuid, payload)
      .then(() => {
        snackbar('success', 'اطلاعات شما با موفقیت ویرایش شد')
      })
      .then(() => closeCallBack?.())
      .then(() => onClose())
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const postInquiryBatch = (payload: AuthenticationDto) => {
    apis.inquiry
      .postInquiryBatch(payload)
      .then(() => {
        snackbar('success', 'اطلاعات شما با موفقیت ثبت شد')
      })
      .then(() => closeCallBack?.())
      .then(() => onClose())
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const setDefaultValues = (inquiryResult: any) => {
    setIsEdit(true)
    reset({
      mobilePhoneNumber:
        inquiryResult.simCardOwnershipInquiry.parameters.mobilePhoneNumber,
      nationalCode: inquiryResult.identityCardInquiry.parameters.nationalCode,
      dateOfBirth: new Date(inquiryResult.identityCardInquiry.parameters.dateOfBirth),
      postalCode: inquiryResult.postalCodeInquiry.parameters.postalCode,
      iban: inquiryResult.ibanInquiry.parameters.iban.split('IR')[1]
    })
  }

  return (
    <Dialog open={open} maxWidth="sm">
      <DialogTitle>احراز هویت</DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid xs={12} item>
              <KTextField
                control={control}
                label="تلفن همراه"
                name="mobilePhoneNumber"
                type="number"
                rules={{ required: required(), validate: mobile }}
                disabled={true}
              />
            </Grid>

            <Grid xs={12} item>
              <KTextField
                control={control}
                label="کد ملی"
                name="nationalCode"
                rules={{ required: required(), validate: nationalCode }}
              />
            </Grid>

            <Grid xs={12} item>
              <KDatePicker
                control={control}
                rules={{ required: required() }}
                label="تاریخ تولد"
                name="dateOfBirth"
              />
            </Grid>

            <Grid xs={12} item>
              <KTextField
                control={control}
                label="کدپستی"
                name="postalCode"
                rules={{ required: required(), validate: postalCode }}
              />
            </Grid>

            <Grid xs={12} item>
              <KTextField
                control={control}
                label="شماره شبا"
                name="iban"
                rules={{ required: required(), validate: iban }}
                InputProps={{
                  endAdornment: (
                    <span style={{ color: 'var(--color-gray-600)' }}>IR</span>
                  ),
                  inputMode: 'numeric',
                  onKeyDown: allowOnlyNumericKeyDown,
                  onPaste: allowOnlyNumericPaste
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />
        <DialogActions>
          <KButton type="submit" variant="contained" color="success" loading={loading}>
            ثبت اطلاعات
          </KButton>
          <KButton type="button" variant="outlined" color="error" onClick={onClose}>
            بستن
          </KButton>
        </DialogActions>
      </form>
    </Dialog>
  )
})
