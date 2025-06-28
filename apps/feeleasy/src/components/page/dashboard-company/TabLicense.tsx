import Paper from '@mui/material/Paper'
import { KTextField, KButton, KDatePicker } from '@components-kits'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'
import { useForm } from 'react-hook-form'
import type { LicenseInfoDto } from '@models/LeasingCompanies'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useContext } from 'react'
import Divider from '@mui/material/Divider'
import { CompanyContext } from '@context/CompanyContext'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { format } from '@utils/date'
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

  const { handleSubmit, control } = useForm<LicenseInfoDto>({
    defaultValues: {
      licenseNumber: info?.licenseNumber,
      startDate: info?.startDate ? new Date(info?.startDate) : null,
      endDate: info?.endDate ? new Date(info?.endDate) : null
    }
  })
  const { required } = useValidations()

  const createPayload = (payload: LicenseInfoDto) => {
    payload.startDate = format(payload.startDate)
    payload.endDate = format(payload.endDate)
    const license = deepClone(payload)
    return { license }
  }

  const onsubmit = async (data: LicenseInfoDto) => {
    const payload = createPayload(data)
    try {
      setLoading(true)
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات مجوز فعالیت با موفقیت ثبت شد')
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
            label="شماره مجوز فعالیت"
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
        <Divider sx={{ marginX: '-10px' }} />

        <DialogActions>
          <KButton type="reset" color="error" onClick={onClose} variant="contained">
            بستن
          </KButton>

          <KButton
            type="submit"
            loading={loading}
            variant="contained"
            color="success"
            disabled={
              approved === BooleanPlus.REQUESTED || approved === BooleanPlus.GRANTED
            }
          >
            ذخیره
          </KButton>
        </DialogActions>
      </form>
    </Paper>
  )
}
