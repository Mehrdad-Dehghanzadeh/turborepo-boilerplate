import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { KButton, KTextField } from '@components-kits'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import { CreateLeasingCompaniesDto } from '@models/LeasingCompanies'
import { getToken } from '@utils/auth'
import useSnackbar from '@hooks/useSnackbar'
import { CompanyContext } from '@context/CompanyContext'
import apis from '@apis'

type PropsType = {
  setStep: any
  onClose: () => void
}

export default function ({ setStep, onClose }: Readonly<PropsType>) {
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<CreateLeasingCompaniesDto>({
    defaultValues: {
      name: '',
      websiteAddress: '',
      ownerUuid: uuid
    }
  })

  const { required } = useValidations()

  const close = () => {
    onClose()
  }

  const onsubmit = async (payload: CreateLeasingCompaniesDto) => {
    try {
      setLoading(true)
      const res = await apis.leasingCompanies.create(payload)
      companyContext.setSelectedCompany?.(res.data)
      companyContext.setLoading?.(true)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات با موفقیت ثبت شد')
      setStep(1)
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
      companyContext.setLoading?.(false)
    }
  }

  return (
    <form id="add-company" name="addCompany" onSubmit={handleSubmit(onsubmit)}>
      <DialogTitle>تعریف شرکت لیزینگ</DialogTitle>

      <DialogContent>
        <KTextField
          sx={{ marginBottom: '24px', marginTop: '12px' }}
          control={control}
          label="نام"
          name="name"
          rules={{ required: required() }}
        />

        <KTextField
          sx={{ marginBottom: '24px' }}
          control={control}
          label="آدرس وب سایت"
          name="websiteAddress"
          rules={{ required: required() }}
        />
      </DialogContent>

      <DialogActions>
        <KButton type="reset" color="error" variant="contained" onClick={close}>
          بستن
        </KButton>

        <KButton type="submit" loading={loading} variant="contained" color="success">
          ثبت
        </KButton>
      </DialogActions>
    </form>
  )
}
