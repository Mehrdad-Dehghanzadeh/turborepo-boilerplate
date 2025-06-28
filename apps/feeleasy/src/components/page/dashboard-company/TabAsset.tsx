import Paper from '@mui/material/Paper'
import { KTextField, KButton } from '@components-kits'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'
import { useForm } from 'react-hook-form'
import type { AssetInfoDto } from '@models/LeasingCompanies'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useContext } from 'react'
import Divider from '@mui/material/Divider'
import { CompanyContext } from '@context/CompanyContext'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { deepClone } from '@utils/object'
import { BooleanPlus } from '@enums/BooleanPlus'

type Porps = {
  onClose: () => void
  info: any
  companyUUID: string
  approved: string
}

export default function ({ onClose, info, companyUUID, approved }: Readonly<Porps>) {
  const { snackbar } = useSnackbar()
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const [loading, setLoading] = useState<boolean>(false)

  const { handleSubmit, control } = useForm<AssetInfoDto>({
    defaultValues: {
      totalEquity: info?.totalEquity,
      registeredCapital: info?.registeredCapital
    }
  })

  const { required } = useValidations()

  const createPayload = (data: AssetInfoDto) => {
    const assetInfo = deepClone(data)
    return { assetInfo }
  }

  const onsubmit = async (data: AssetInfoDto) => {
    const payload = createPayload(data)
    try {
      setLoading(true)
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات مالی با موفقیت ثبت شد')
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper component="section" sx={{ paddingX: '16px', paddingBottom: '16px' }}>
      <form
        id="contact-form"
        name="postal-adderss-form"
        onSubmit={handleSubmit(onsubmit)}
      >
        <DialogContent sx={{ width: '680px' }}>
          <KTextField
            sx={{ marginBottom: '24px', marginTop: '12px' }}
            control={control}
            label="سرمایه ثبت شده"
            name="registeredCapital"
            rules={{ required: required() }}
            type="number"
            filterPrice
          />

          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="جمع حقوق مالکانه"
            name="totalEquity"
            rules={{ required: required() }}
            type="number"
            filterPrice
          />
        </DialogContent>
        <Divider sx={{ marginX: '-10px' }} />

        <DialogActions>
          <KButton type="reset" color="error" onClick={onClose} variant="contained">
            بستن
          </KButton>

          <KButton
            type="submit"
            loading={loading}
            disabled={
              approved === BooleanPlus.REQUESTED || approved === BooleanPlus.GRANTED
            }
            variant="contained"
            color="success"
          >
            ذخیره
          </KButton>
        </DialogActions>
      </form>
    </Paper>
  )
}
