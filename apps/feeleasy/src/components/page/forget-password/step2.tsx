import { KButton, KTextField } from '@components/kits'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import useValidations from '@hooks/useValidations'

type PropsType = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  activeStep: number
  sendOtp: (arg1: any, arg2: string) => any
  phoneNumber: NumberString
  setUuid: any
}

interface FormValues {
  verificationCode: string
  intent: string
}

const RESENT_OTP = 90

export default function Step2({
  activeStep,
  setActiveStep,
  sendOtp,
  phoneNumber,
  setUuid
}: Readonly<PropsType>) {
  const [time, setTime] = useState<number>(RESENT_OTP)
  const { snackbar } = useSnackbar()
  const { handleSubmit, control, reset } = useForm<FormValues>()
  const [loading, setLoading] = useState<boolean>(false)
  const { required } = useValidations()

  const resendOtp = () => {
    const msg = 'کد تایید مجددا ارسال شد'
    reset()
    setTime(RESENT_OTP)
    sendOtp({ mobilePhoneNumber: phoneNumber }, msg)
  }

  const handleBack = () => {
    setActiveStep((s: number) => s - 1)
    reset()
    setTime(RESENT_OTP)
  }

  const onsubmit = (data: FormValues) => {
    setLoading(true)
    data.intent = 'VERIFY_MOBILE'

    apis.users
      .checkForgetPasswordOtp(phoneNumber, data)
      .then(({ data }: any) => {
        snackbar('success', 'کد با موفقیت تایید شد')
        setActiveStep(2)
        setUuid(data.userUuid)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
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
    <form className="forget-password" onSubmit={handleSubmit(onsubmit)}>
      <ArrowBackOutlinedIcon className="back-icon" onClick={handleBack} />

      {time > 0 ? (
        <Typography
          variant="body1"
          sx={{ fontSize: '14px', color: 'var(--color-gray-600)' }}
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
          display: 'flex',
          gap: '0 8px',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--color-info-main)'
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
