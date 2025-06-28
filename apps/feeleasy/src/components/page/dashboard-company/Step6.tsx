import { KButton, KTextField } from '@components-kits'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import ControlPointIcon from '@mui/icons-material/ArrowCircleLeft'
import useSnackbar from '@hooks/useSnackbar'
import { CompanyContext } from '@context/CompanyContext'
import { AssetInfoDto } from '@models/LeasingCompanies'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { deepClone } from '@utils/object'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

type PropsType = {
  onClose: () => void
}

export default function ({ onClose }: Readonly<PropsType>) {
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<AssetInfoDto>({
    defaultValues: {
      registeredCapital: null,
      totalEquity: null
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
      const companyUUID = companyContext.selectedCompany.uuid
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      companyContext.setLoading?.(true)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات مالی با موفقیت ثبت شد')
      onClose()
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
      companyContext.setLoading?.(false)
    }
  }

  return (
    <form
      id="add-assets-info-company"
      name="addAssetsInfoCompany"
      onSubmit={handleSubmit(onsubmit)}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>ثبت اطلاعات مالی</span>
        <CancelOutlinedIcon sx={{ color: 'red' }} onClick={() => onClose()} />
      </DialogTitle>

      <DialogContent>
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

      <DialogActions>
        <KButton
          type="submit"
          loading={loading}
          variant="contained"
          color="success"
          endIcon={<ControlPointIcon />}
        >
          ثبت
        </KButton>
      </DialogActions>
    </form>
  )
}
