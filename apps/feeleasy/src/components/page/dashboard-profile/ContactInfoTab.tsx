import Paper from '@mui/material/Paper'
import { useAppStore } from '@store'
import { KButton, KFieldset, KInfo, KTextField } from '@components/kits'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import Divider from '@mui/material/Divider'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { deepClone } from '@utils/object'
import { useEffect, useRef, useState } from 'react'
import { enumsProvider } from '@utils/enums'
import { Chip, Typography } from '@mui/material'

interface ConstactInfo {
  landlinePhoneNumber: NumberString
  mobilePhoneNumber: NumberString
  emailAddress: string
}

export default function () {
  const user = useAppStore((state) => state.user)
  const verification = useAppStore((state) => state.verification)
  const updateUser = useAppStore((state) => state.updateUser)
  const { control, handleSubmit } = useForm<ConstactInfo>({
    defaultValues: {
      landlinePhoneNumber: user?.contactInfo?.landlinePhoneNumber ?? '',
      emailAddress: user?.contactInfo?.emailAddress ?? ''
    }
  })

  const { required, phone, email } = useValidations()
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const [isEditEmail, setIsEditEmail] = useState<boolean>(false)
  const emailRef = useRef<any>()

  useEffect(() => {
    if (isEditEmail && emailRef.current) {
      emailRef.current.focus()
    }
  }, [isEditEmail])

  const handleLandEditContactInfo = (data: ConstactInfo) => {
    setLoading(true)

    const payload = deepClone(data)
    payload.mobilePhoneNumber = user?.contactInfo?.mobilePhoneNumber
    payload.emailAddress = payload.emailAddress ?? user?.contactInfo?.emailAddress

    apis.users
      .updateContactInfo(user?.uuid, payload)
      .then(() => updateUser())
      .then(() => snackbar('success', 'اطلاعات با موفقیت ثبت شد'))
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  return (
    <Paper
      component="section"
      id="profile-tabs-contact-info"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <form onSubmit={handleSubmit(handleLandEditContactInfo)}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={6}>
            <KTextField
              control={control}
              name="landlinePhoneNumber"
              placeholder="تلفن ثابت"
              rules={{ required: required(), validate: phone }}
              label="شماره تلفن ثابت"
            />
          </Grid>

          {isEditEmail && (
            <Grid item xs={12} md={6}>
              <KTextField
                control={control}
                name="emailAddress"
                label="ویرایش ایمیل"
                rules={{ required: required(), validate: email }}
                placeholder="ایمیل"
                inputRef={emailRef}
              />
            </Grid>
          )}
        </Grid>

        <KButton
          type="submit"
          variant="contained"
          color="success"
          loading={loading}
          sx={{ marginTop: '13px' }}
        >
          ثبت
        </KButton>
      </form>

      <Divider sx={{ marginTop: '30px ', marginBottom: '20px' }} />

      <KFieldset title="اطلاعات تماس">
        <Grid container>
          <Grid
            sx={{ display: 'flex', justifyContent: 'start', alignItems: 'baseline' }}
            item
            xs={12}
            md={6}
          >
            <KInfo
              title="شماره تلفن همراه"
              value={user?.contactInfo?.mobilePhoneNumber}
            />

            <Chip
              variant="outlined"
              size="small"
              color={
                enumsProvider('States', verification?.mobilePhoneNumberVerified)?.color
              }
              label={
                enumsProvider('States', verification?.mobilePhoneNumberVerified)?.title
              }
            />
          </Grid>

          {user?.contactInfo?.landlinePhoneNumber && (
            <Grid item xs={12} md={6}>
              <KInfo
                title="شماره تلفن ثابت"
                value={user?.contactInfo?.landlinePhoneNumber}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'baseline' }}>
            <KInfo title="ادرس الکترونیکی" value={user?.contactInfo?.emailAddress} />
            <KButton
              onClick={() => {
                setIsEditEmail(true)
                emailRef?.current?.focus()
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ cursor: 'pointer', color: 'var(--color-info-main)' }}
              >
                ویرایش
              </Typography>
            </KButton>
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="وضعیت مالکیت سیم کارت"
              value={
                <Chip
                  variant="outlined"
                  size="small"
                  color={
                    enumsProvider('States', verification?.simCardOwnershipConfirmed)
                      ?.color
                  }
                  label={
                    enumsProvider('States', verification?.simCardOwnershipConfirmed)
                      ?.title
                  }
                />
              }
            />
          </Grid>
        </Grid>
      </KFieldset>
    </Paper>
  )
}
