import useValidations from '@hooks/useValidations'
import { KPasswordField, KButton, KTextField } from '@components-kits'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'
import useSnackbar from '@hooks/useSnackbar'
import apis from '@apis'

type Props = {
  setActiveStep: any
  uuid: string
}

interface FormValues {
  password: string
  rePassword: string
}

export default function Step3({ setActiveStep, uuid }: Readonly<Props>) {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm<FormValues>()
  const { required, email, minLength, strongPassword } = useValidations()
  const { snackbar } = useSnackbar()
  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    setLoading(true)
    apis.users
      .setCredential(uuid, data)
      .then(() => {
        snackbar('success', 'رمزعبور با موفقیت تغییر کرد')
        router.replace('/login')
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const handleBack = () => setActiveStep((s: number) => s - 1)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ArrowBackOutlinedIcon className="back-icon" onClick={handleBack} />

      <KPasswordField
        sx={{ marginBottom: '24px' }}
        rules={{
          required: required(),
          minLength: minLength(8),
          validate: strongPassword
        }}
        control={control}
        type="password"
        name="password"
        label="کلمه عبور"
        autoComplete="new-password"
      />

      <KButton
        loading={loading}
        variant="contained"
        type="submit"
        fullWidth
        color="success"
      >
        ثبت
      </KButton>
    </form>
  )
}
