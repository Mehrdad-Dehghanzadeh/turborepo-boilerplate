import useValidations from '@hooks/useValidations'
import { KPasswordField, KButton, KTextField } from '@components-kits'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'
import useSnackbar from '@hooks/useSnackbar'
import apis from '@apis'
import { setUUID } from '@utils/auth'

type Props = {
  setActiveStep: any
  uuid: string
}

interface FormValues {
  password: string
  rePassword: string
}

export default function ({ setActiveStep, uuid }: Readonly<Props>) {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm<FormValues>()
  const { required, email, minLength, strongPassword } = useValidations()
  const { snackbar } = useSnackbar()
  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    setLoading(true)
    apis.users
      .setCredential(uuid, data)
      .then(({ data }: any) => {
        snackbar('success', 'ثبتنام شما با موفقیت انجام شد')
        setUUID(data.uuid)
      })
      .then(() => router.replace('/dashboard/profile'))
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const handleBack = () => setActiveStep((s: number) => s - 1)

  return (
    <form
      className="step-3-sign-up-form"
      id="step3SignUpForm"
      name="step3SignUpForm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ArrowBackOutlinedIcon className="back-icon" onClick={handleBack} />

      <KTextField
        sx={{ margin: '15px 0' }}
        rules={{ required: required(), validate: email }}
        control={control}
        name="email"
        label="ایمیل"
        placeholder="لطفا ایمیل را وارد کنید"
      />

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
