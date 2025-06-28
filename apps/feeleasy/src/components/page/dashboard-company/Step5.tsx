import { KButton, KDatePicker, KTextField } from '@components-kits'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import ControlPointIcon from '@mui/icons-material/ArrowCircleLeft'
import useSnackbar from '@/hooks/useSnackbar'
import { CompanyContext } from '@context/CompanyContext'
import { LicenseInfoDto } from '@models/LeasingCompanies'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { deepClone } from '@utils/object'
import { format } from '@utils/date'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

type PropsType = {
  onClose: () => void
  setStep: any
}

export default function ({ setStep, onClose }: Readonly<PropsType>) {
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<LicenseInfoDto>({
    defaultValues: {
      licenseNumber: null,
      startDate: null,
      endDate: null
    }
  })

  const { required } = useValidations()

  const createPayload = (data: LicenseInfoDto) => {
    data.startDate = format(data.startDate)
    data.endDate = format(data.endDate)
    const license = deepClone(data)
    return { license }
  }

  const onsubmit = async (data: LicenseInfoDto) => {
    const payload = createPayload(data)
    try {
      setLoading(true)
      const companyUUID = companyContext.selectedCompany.uuid
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      companyContext.setLoading?.(true)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات مجوز فعالیت با موفقیت ثبت شد')
      setStep(5)
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
      companyContext.setLoading?.(false)
    }
  }

  return (
    <form
      id="add-licence-info-company"
      name="addLicenceInfoCompany"
      onSubmit={handleSubmit(onsubmit)}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>اطلاعات مجوز فعالیت</span>
        <CancelOutlinedIcon sx={{ color: 'red' }} onClick={() => onClose()} />
      </DialogTitle>

      <DialogContent>
        <KTextField
          sx={{ marginBottom: '24px', marginTop: '12px' }}
          control={control}
          label="شماره مجوز"
          name="licenseNumber"
          rules={{ required: required() }}
        />

        <KDatePicker
          sx={{ marginBottom: '24px' }}
          control={control}
          label="تاریخ شروع"
          name="startDate"
          rules={{ required: required(), valueAsDate: true }}
        />

        <KDatePicker
          sx={{ marginBottom: '24px' }}
          control={control}
          label="تاریخ پایان"
          name="endDate"
          rules={{ required: required(), valueAsDate: true }}
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
