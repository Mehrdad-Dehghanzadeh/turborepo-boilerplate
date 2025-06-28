import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { KTextField, KButton, KFieldset, KInfo } from '@components-kits'
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import useValidations from '@/hooks/useValidations'
import { deepClone } from '@/utils/object'
import Divider from '@mui/material/Divider'
import type { ShopInfoProps } from '@models/Shop'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'

export default function ({ shop, getShopInfo, disabled }: ShopInfoProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { required, postalCode } = useValidations()
  const { snackbar } = useSnackbar()

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      postalCode: ''
    }
  })

  const onSubmitForm = (data: any) => {
    setLoading(true)
    const payload = deepClone(data)
    if (!shop) {
      snackbar('error', 'لطفا ابتدا فروشگاه خود را ایجاد کنید')
      setLoading(false)
      return
    }

    apis.shop
      .update(shop?.uuid, payload)
      .then(() => getShopInfo())
      .then(() => {
        snackbar('success', 'اطلاعات پستی فروشگاه باموفقیت بروز شد')
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
      setValue('postalCode', shop?.postalAddress?.postalCode || '')
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
              rules={{ required: required(), validate: postalCode }}
              name="postalCode"
              label="کدپستی"
              type="number"
              inputMode="numeric"
              disabled={disabled}
            />
          </Grid>
        </Grid>

        {shop?.postalAddress && (
          <KFieldset className="mt-10" title="اطلاعات آدرس پستی">
            <Grid className="pt-4" spacing={2} container>
              <Grid xs={12} sm={6} md={4} item>
                <KInfo title="استان" value={shop?.postalAddress?.state} />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KInfo title="شهر" value={shop?.postalAddress?.city} />
              </Grid>

              <Grid xs={12} md={8} item>
                <KInfo title="آدرس" value={shop?.postalAddress?.address} />
              </Grid>
            </Grid>
          </KFieldset>
        )}

        <Divider sx={{ marginTop: '48px', marginBottom: '20px' }} />

        <div className="d-flex justify-content-end">
          <KButton
            variant="contained"
            type="submit"
            loading={loading}
            startIcon={<DataSaverOnIcon />}
            disabled={disabled}
          >
            استعلام و ذخیره
          </KButton>
        </div>
      </form>
    </Paper>
  )
}
