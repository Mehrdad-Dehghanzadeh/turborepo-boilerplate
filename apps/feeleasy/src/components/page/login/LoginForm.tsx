'use client'
import { useForm } from 'react-hook-form'
import { KTextField, KButton, KPasswordField } from '@components-kits'
import useValidations from '@hooks/useValidations'
import LoginIcon from '@mui/icons-material/Login'
import { checkMobile, isEmail } from '@assets/validations'
import apis from '@apis'
import { useState } from 'react'
import useSnackbar from '@hooks/useSnackbar'
import type { LoginEmailDto, LoginMobileDto } from '@models/Login'
import { useRouter } from 'next/navigation'
import { setUUID } from '@utils/auth'

type FormValues = {
  emailOrphoneNumber: string
  password: string
}

export default function LoginForm() {
  const { snackbar } = useSnackbar()
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      emailOrphoneNumber: '',
      password: ''
    }
  })

  const { required, emailOrMobile } = useValidations()

  const loginWithMobile = async (payload: LoginMobileDto) => {
    try {
      setLoading(true)
      const { data } = await apis.auth.loginMobile(payload)
      setUUID(data.UUID)
      router.replace('/dashboard/profile')
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
    }
  }

  const loginWithEmail = async (payload: LoginEmailDto) => {
    try {
      setLoading(true)
      const { data } = await apis.auth.loginEmail(payload)
      setUUID(data.UUID)
      router.replace('/dashboard/profile')
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
    }
  }

  const onsubmit = ({ emailOrphoneNumber, password }: FormValues) => {
    if (checkMobile(emailOrphoneNumber)) {
      loginWithMobile({ password, mobilePhoneNumber: emailOrphoneNumber })
    }
    if (isEmail(emailOrphoneNumber)) {
      loginWithEmail({ password, email: emailOrphoneNumber })
    }
  }

  return (
    <form className="login-form" id="loginForm" onSubmit={handleSubmit(onsubmit)}>
      <KTextField
        control={control}
        isConvertPersianNumber
        rules={{ required: required(), validate: emailOrMobile }}
        name="emailOrphoneNumber"
        label="ایمیل یا شماره تماس"
        placeholder="لطفا ایمیل یا شماره تماس را وارد کنید"
      />

      <KPasswordField
        sx={{ marginTop: '24px', marginBottom: '24px' }}
        rules={{ required: required() }}
        control={control}
        isConvertPersianNumber
        type="password"
        name="password"
        label="کلمه عبور"
        autoComplete="new-password"
      />

      <KButton
        loading={loading}
        variant="contained"
        type="submit"
        startIcon={<LoginIcon />}
        fullWidth
      >
        ورود
      </KButton>
    </form>
  )
}
