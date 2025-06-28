'use client'
import { useForm } from 'react-hook-form'
import { KTextField, KButton } from '@components-kits'
import useValidations from '@hooks/useValidations'

type FormValues = {
  mobilePhoneNumber: string
}

type Props = {
  sendOtp: any
  loading: boolean
}

export default function Step1({ sendOtp, loading }: Readonly<Props>) {
  const { handleSubmit, control } = useForm<FormValues>()
  const { required, mobile } = useValidations()

  const onsubmit = (data: FormValues) => {
    const msg = 'کد تایید با موفقیت ارسال شد'
    sendOtp(data, msg)
  }

  return (
    <form
      className="step-1-sign-up-form"
      id="step1SignUpForm"
      name="step1SignUpForm"
      onSubmit={handleSubmit(onsubmit)}
    >
      <KTextField
        sx={{ marginBottom: '24px' }}
        control={control}
        rules={{ required: required(), validate: mobile }}
        name="mobilePhoneNumber"
        label="شماره تلفن همراه"
        inputProps={{ maxLength: 11 }}
      />

      <KButton
        loading={loading}
        variant="contained"
        type="submit"
        fullWidth
        color="success"
      >
        ثبت نام
      </KButton>
    </form>
  )
}
