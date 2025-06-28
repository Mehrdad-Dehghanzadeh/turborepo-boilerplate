import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { KTextField, KButton } from '@components-kits'
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import useValidations from '@hooks/useValidations'
import { deepClone } from '@utils/object'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import Divider from '@mui/material/Divider'
import type { ShopInfoProps, BasicInfo, CreateShopDto } from '@models/Shop'
import { useAppStore } from '@store'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function ({ shop, getShopInfo, disabled }: ShopInfoProps) {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [finalSubmitLoading, setFinalSubmitLoading] = useState<boolean>(false)
  const { required, minLength } = useValidations()
  const { snackbar } = useSnackbar()
  const isEdit = shop?.uuid
  const user = useAppStore((state) => state.user)
  const updateUser = useAppStore((state) => state.updateUser)

  const { handleSubmit, control, setValue } = useForm<BasicInfo>({
    defaultValues: {
      name: '',
      websiteAddress: ''
    }
  })

  const generateCreatePayload = (data: CreateShopDto) => {
    const basicInfo = deepClone(data)
    basicInfo.ownerUuid = user?.uuid
    return basicInfo
  }

  const generateUpdatePayload = (data: BasicInfo) => {
    const basicInfo = deepClone(data)
    return basicInfo
  }

  const onSubmitForm = async (data: BasicInfo) => {
    setSubmitLoading(true)

    try {
      const createPayload = generateCreatePayload(data)
      const updatePayload = generateUpdatePayload(data)
      const message = isEdit
        ? 'اطلاعات شما با موفقیت بروز شد'
        : 'فروشگاه شما با موفقیت ایجاد شد'

      if (isEdit) {
        await apis.shop.update(shop?.uuid, updatePayload)
      } else {
        await apis.shop.create(createPayload)
      }
      snackbar('success', message)
      await updateUser()
    } catch (err) {
      snackbar('error', err)
    } finally {
      setSubmitLoading(false)
    }
  }

  const finalSubmit = async () => {
    try {
      const shopInfo = await getShopInfo()
      setFinalSubmitLoading(true)

      if (!shopInfo) {
        snackbar('error', 'لطفا ابتدا فروشگاه خود را ایجاد کنید')
        setFinalSubmitLoading(false)
        return
      }

      const payload = {
        approved: BooleanPlus.REQUESTED
      }

      const shopUuid = shopInfo?.uuid

      await apis.shop.approve(shopUuid, payload)
      snackbar('success', 'درخواست شما با موفقیت انجام شد')
      getShopInfo()
    } catch (error) {
      snackbar('error', error)
    } finally {
      setFinalSubmitLoading(false)
    }
  }

  useEffect(() => {
    if (shop) {
      setValue('name', shop.name || '')
      setValue('websiteAddress', shop.websiteAddress || '')
    }
  }, [shop, setValue])

  return (
    <Paper
      component="section"
      id="profile-tabs-basic-info"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid spacing={2} container>
          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              rules={{ required: required(), minLength: minLength(3) }}
              name="name"
              label="نام فروشگاه"
              type="text"
              disabled={disabled}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} sx={{ marginBottom: '12px' }} item>
            <KTextField
              control={control}
              rules={{ minLength: minLength(5) }}
              name="websiteAddress"
              label="آدرس وبسایت"
              type="text"
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Divider sx={{ marginTop: '48px', marginBottom: '20px' }} />

        <div className="d-flex justify-content-end">
          <KButton
            variant="outlined"
            type="button"
            loading={finalSubmitLoading}
            sx={{ margin: '0 12px' }}
            onClick={finalSubmit}
            disabled={disabled}
          >
            ارسال برای تایید
          </KButton>
          <KButton
            variant="contained"
            type="submit"
            loading={submitLoading}
            startIcon={<DataSaverOnIcon />}
            disabled={disabled}
          >
            {shop ? 'ذخیره' : 'ایجاد فروشگاه'}
          </KButton>
        </div>
      </form>
    </Paper>
  )
}
