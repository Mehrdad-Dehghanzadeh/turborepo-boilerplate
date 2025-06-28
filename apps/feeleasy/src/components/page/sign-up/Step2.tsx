'use client'
import { useForm } from 'react-hook-form'
import { KButton, KTextField } from '@components-kits'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import './SignUp.scss'
import EditIcon from '@mui/icons-material/Edit'
import Typography from '@mui/material/Typography'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import apis from '@apis'

type Props = {
  setActiveStep: any
  activeStep: any
  phoneNumber: string
  setUuid: any
  sendOtp: any
}

interface FormValues {
  verificationCode: string
  mobilePhoneNumber: string
}

const RESENT_OTP = 90

export default function Step2({
  setActiveStep,
  activeStep,
  phoneNumber,
  setUuid,
  sendOtp
}: Readonly<Props>) {
  const { snackbar } = useSnackbar()
  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {}
  })
  const { required, minLength, maxLength } = useValidations()
  const [loading, setLoading] = useState<boolean>(false)
  const [time, setTime] = useState<number>(RESENT_OTP)

  const onsubmit = (data: FormValues) => {
    setLoading(true)
    data.mobilePhoneNumber = phoneNumber
    const payload = data
    apis.users
      .checkOtp(payload)
      .then(({ data: user }: any) => {
        snackbar('success', 'کد با موفقیت تایید شد')
        setUuid(user?.uuid)
        setActiveStep(2)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const handleBack = () => {
    setActiveStep((s: number) => s - 1)
    reset()
    setTime(RESENT_OTP)
  }

  const resendOtp = () => {
    const msg = 'کد تایید مجددا ارسال شد'
    reset()
    setTime(RESENT_OTP)
    sendOtp({ mobilePhoneNumber: phoneNumber }, msg)
  }

  useEffect(() => {
    if (activeStep === 1) {
      const timer = time > 0 && setInterval(() => setTime((t) => t - 1), 1000)
      return () => {
        if (timer) clearInterval(timer)
      }
    }
  }, [time, activeStep])

  return (
    <form
      className="step-2-sign-up-form"
      id="step2SignUpForm"
      name="step2SignUpForm"
      onSubmit={handleSubmit(onsubmit)}
    >
      <ArrowBackOutlinedIcon className="back-icon" onClick={handleBack} />

      {time > 0 ? (
        <Typography
          variant="body1"
          sx={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '12px' }}
        >
          {time} ثانیه تا ارسال مجدد کد تایید
        </Typography>
      ) : (
        <KButton
          variant="outlined"
          color="info"
          size="small"
          onClick={() => resendOtp()}
          sx={{ margin: '10px 0' }}
        >
          ارسال مجدد کد تایید
        </KButton>
      )}
      <KTextField
        sx={{ margin: '15px 0' }}
        rules={{ required: required() }}
        control={control}
        name="verificationCode"
        label="کد یکبار مصرف"
        placeholder="لطفا شماره تلفن همراه را وارد کنید"
      />

      <Box
        sx={{
          display: 'flex ',
          gap: '0 8px',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--color-info-500)'
        }}
        onClick={handleBack}
      >
        <Box component="small" sx={{ marginBottom: '10px' }}>
          ویرایش تلفن همراه
        </Box>
        <Box>
          <EditIcon sx={{ fontSize: '20px', color: 'primary' }} />
        </Box>
      </Box>

      <KButton
        loading={loading}
        variant="contained"
        type="submit"
        fullWidth
        color="success"
      >
        تایید
      </KButton>
    </form>
  )
}
