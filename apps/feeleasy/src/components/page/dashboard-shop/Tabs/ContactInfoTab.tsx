import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { KTextField, KButton } from '@components-kits'
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import useValidations from '@/hooks/useValidations'
import { deepClone } from '@/utils/object'
import Divider from '@mui/material/Divider'
import useSnackbar from '@hooks/useSnackbar'
import type { ShopInfoProps, ContactInfo } from '@models/Shop'
import apis from '@apis'

export default function ({ shop, getShopInfo, disabled }: ShopInfoProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { required, email, mobile, phone } = useValidations()
  const { snackbar } = useSnackbar()

  const { handleSubmit, control, setValue } = useForm<ContactInfo>({
    defaultValues: {
      mobilePhoneNumber: '',
      landlinePhoneNumber: '',
      emailAddress: ''
    }
  })

  const createPayload = (data: ContactInfo) => {
    const contactInfo = deepClone(data)
    return { contactInfo }
  }

  const onSubmitForm = (data: ContactInfo) => {
    setLoading(true)
    const payload = createPayload(data)
    if (!shop) {
      snackbar('error', 'لطفا ابتدا فروشگاه خود را ایجاد کنید')
      setLoading(false)
      return
    }

    apis.shop
      .update(shop?.uuid, payload)
      .then(() => getShopInfo())
      .then(() => {
        snackbar('success', 'اطلاعات تماس فروشگاه باموفقیت بروز شد')
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (shop) {
      setValue('mobilePhoneNumber', shop.contactInfo?.mobilePhoneNumber || '')
      setValue('landlinePhoneNumber', shop.contactInfo?.landlinePhoneNumber || '')
      setValue('emailAddress', shop.contactInfo?.emailAddress || '')
    }
  }, [shop, setValue])

  return (
    <Paper
      component="section"
      id="profile-tabs-national-card"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid spacing={2} container>
          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              rules={{ required: required(), validate: mobile }}
              name="mobilePhoneNumber"
              type="number"
              inputMode="numeric"
              label="موبایل"
              disabled={disabled}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              rules={{ required: required(), validate: phone }}
              name="landlinePhoneNumber"
              type="number"
              inputMode="numeric"
              label="تلفن ثابت"
              disabled={disabled}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              rules={{ required: required(), validate: email }}
              name="emailAddress"
              label="ایمیل"
              type="text"
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Divider sx={{ marginTop: '48px', marginBottom: '20px' }} />

        <div className="d-flex justify-content-end">
          <KButton
            variant="contained"
            type="submit"
            loading={loading}
            startIcon={<DataSaverOnIcon />}
            disabled={disabled}
          >
            ذخیره
          </KButton>
        </div>
      </form>
    </Paper>
  )
}
