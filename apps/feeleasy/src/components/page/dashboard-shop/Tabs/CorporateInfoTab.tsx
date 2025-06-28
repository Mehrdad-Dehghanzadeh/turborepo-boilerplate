import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { KTextField, KButton, KDatePicker, KSelect } from '@components-kits'
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { deepClone } from '@utils/object'
import useSnackbar from '@hooks/useSnackbar'
import Divider from '@mui/material/Divider'
import { CompanyTypeList } from '@enums/CompanyType'
import { format } from '@utils/date'
import useValidations from '@hooks/useValidations'
import type { ShopInfoProps, CorporateInfo } from '@models/Shop'
import apis from '@apis'

export default function ({ shop, getShopInfo, disabled }: ShopInfoProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()

  const { handleSubmit, control, setValue } = useForm<CorporateInfo>({
    defaultValues: {
      officialName: '',
      nationalId: '',
      registrationNumber: '',
      incorporationInfo: {
        incorporationDate: '',
        announcementNumber: ''
      },
      companyType: '',
      businessCode: ''
    }
  })

  const { minLength, legalNationalCode, required } = useValidations()

  const createPayload = (data: CorporateInfo) => {
    const corporateInfo = deepClone(data)
    corporateInfo.incorporationInfo.incorporationDate = format(
      data.incorporationInfo.incorporationDate
    )
    return { corporateInfo }
  }

  const onSubmitForm = (data: CorporateInfo) => {
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
        snackbar('success', 'اطلاعات حقوقی فروشگاه باموفقیت بروز شد')
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
      setValue('officialName', shop.corporateInfo?.officialName || '')
      setValue('nationalId', shop.corporateInfo?.nationalId || '')
      setValue('registrationNumber', shop.corporateInfo?.registrationNumber || '')
      setValue(
        'incorporationInfo.incorporationDate',
        shop?.corporateInfo?.incorporationInfo?.incorporationDate
          ? new Date(shop?.corporateInfo?.incorporationInfo?.incorporationDate)
          : null
      )
      setValue(
        'incorporationInfo.announcementNumber',
        shop?.corporateInfo?.incorporationInfo?.announcementNumber || ''
      )
      setValue('companyType', shop?.corporateInfo?.companyType || '')
      setValue('businessCode', shop?.corporateInfo?.businessCode || '')
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
              name="officialName"
              type="text"
              label="نام رسمی"
              rules={{ required: required(), minLength: minLength(3) }}
              disabled={disabled}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              name="nationalId"
              type="number"
              inputMode="numeric"
              rules={{ required: required(), validate: legalNationalCode }}
              label="شناسه ملی"
              disabled={disabled}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              name="registrationNumber"
              type="text"
              label="شماره ثبت"
              rules={{ required: required() }}
              disabled={disabled}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KDatePicker
              control={control}
              name="incorporationInfo.incorporationDate"
              label="تاریخ تاسیس"
              rules={{ required: required() }}
              disabled={disabled}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KSelect
              control={control}
              name="companyType"
              items={CompanyTypeList}
              label="نوع شرکت"
              disabled={disabled}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              name="incorporationInfo.announcementNumber"
              type="number"
              inputMode="numeric"
              label="شماره آگهی"
              disabled={disabled}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              name="businessCode"
              label="کد اقتصادی"
              type="number"
              inputMode="numeric"
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
