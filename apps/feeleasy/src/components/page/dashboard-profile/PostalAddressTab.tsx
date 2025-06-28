import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { KButton, KFieldset, KInfo, KTextField } from '@components-kits'
import { enumsProvider } from '@utils/enums'
import { Chip } from '@mui/material'
import { useAppStore } from '@store'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import useValidations from '@hooks/useValidations'

export default function () {
  const user = useAppStore((state) => state.user)
  const verification = useAppStore((state) => state.verification)
  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const { required } = useValidations()
  const updateUser = useAppStore((state) => state.updateUser)

  const { control, handleSubmit } = useForm<any>({
    defaultValues: {
      comment: user?.postalAddress?.comment ?? ''
    }
  })
  const onSubmit = (data: string) => {
    setLoading(true)
    const userUuid = user?.uuid

    apis.users
      .updatePostalAddress(userUuid, data)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        updateUser()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  return (
    <Paper
      component="section"
      id="profile-tabs-postal-address"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <KFieldset title="اطلاعات پستی">
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: 'flex', justifyContent: 'start', alignItems: 'baseline' }}
          >
            <KInfo title="کدپستی" value={user?.postalAddress?.postalCode} />

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

          <Grid item xs={12} md={6}>
            <KInfo title="استان" value={user?.postalAddress?.state} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="شهر" value={user?.postalAddress?.city} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="آدرس پستی"
              value={`${user?.postalAddress?.address} ${
                user?.postalAddress?.comment ? `- ${user?.postalAddress?.comment}` : ''
              } `}
            />
          </Grid>
        </Grid>
      </KFieldset>

      <Grid container spacing={5}>
        <Grid item xs={12} md={6} sx={{ margin: '20px 0' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <KTextField
              control={control}
              name="comment"
              label="توضیحات آدرس"
              multiline
              minRows={5}
              rules={{ required: required() }}
            />
            <KButton
              variant="contained"
              color="success"
              type="submit"
              sx={{ margin: '10px 0' }}
              loading={loading}
            >
              ثبت
            </KButton>
          </form>
        </Grid>
      </Grid>
    </Paper>
  )
}
