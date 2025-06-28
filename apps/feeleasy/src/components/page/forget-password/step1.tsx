'use client'
import useValidations from '@hooks/useValidations'
import { KButton, KTextField } from '@components/kits'
import { useForm } from 'react-hook-form'

type PropsType = {
  sendOtp: (arg1: any, arg2: string) => any
  loading: boolean
}

interface FormValues {
  mobilePhoneNumber: string
  intent: string
}

export default function Step1({ sendOtp, loading }: Readonly<PropsType>) {
  const { handleSubmit, control } = useForm<any>()
  const { required, mobile } = useValidations()

  const onSubmit = (data: FormValues) => {
    const msg = 'کد تایید با موفقیت ارسال شد'
    sendOtp(data, msg)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <KTextField
        control={control}
        name="mobilePhoneNumber"
        label="شماره تلفن همراه"
        rules={{ required: required(), validate: mobile }}
      />
      <KButton
        type="submit"
        variant="contained"
        color="success"
        sx={{ margin: '10px 0' }}
        size="small"
        loading={loading}
      >
        ارسال کد تایید
      </KButton>
    </form>
  )
}
