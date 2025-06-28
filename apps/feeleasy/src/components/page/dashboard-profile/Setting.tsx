import { KButton, KCheckbox } from '@components/kits'
import { useForm } from 'react-hook-form'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import { useState } from 'react'
import { ProfileSetting } from '@models/Users'
import { useAppStore } from '@store'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'

export default function () {
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const user = useAppStore((state) => state.user)
  const settings = useAppStore((state) => state.settings)
  const updateUser = useAppStore((state) => state.updateUser)
  const { snackbar } = useSnackbar()

  const { handleSubmit, control, setValue } = useForm<ProfileSetting>({
    defaultValues: {
      viewAddShopForm: settings?.viewAddShopForm,
      viewAddLeasingCompanyForm: settings?.viewAddLeasingCompanyForm
    }
  })

  const onSubmitForm = (data: ProfileSetting) => {
    setDisabled(true)
    setLoading(true)
    const userUuid = user?.uuid
    apis.users
      .profileSetting(data, userUuid)
      .then(() => updateUser())
      .then(() => {
        snackbar('success', 'تنظیمات با موفقیت اعمال شد')
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setDisabled(false)
        setLoading(false)
      })
  }

  return (
    <Paper
      component="section"
      id="profile-tabs-postal-address"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <KCheckbox
              control={control}
              name="viewAddShopForm"
              label="نمایش منوی تعریف فروشگاه"
              onChange={(e) => {
                setValue('viewAddShopForm', e.target.checked ? true : false)
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KCheckbox
              control={control}
              name="viewAddLeasingCompanyForm"
              label="نمایش منوی تعریف نهاد مالی"
              onChange={(e) => {
                setValue('viewAddLeasingCompanyForm', e.target.checked ? true : false)
              }}
            />
          </Grid>
          <Divider sx={{ marginTop: '48px', marginBottom: '20px' }} />
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <KButton
            loading={loading}
            disabled={disabled}
            variant="outlined"
            color="info"
            startIcon={<SettingsSuggestIcon />}
            type="submit"
          >
            ذخیره تنظیمات
          </KButton>
        </Box>
      </form>
    </Paper>
  )
}
